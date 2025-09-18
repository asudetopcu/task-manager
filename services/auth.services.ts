import { User } from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function register(name: string, email: string, password: string) {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const errors = { name: [] as string[], email: [] as string[], password: [] as string[]};
    
    if(!normalizedName) errors.name.push("Ad alanı boş olamaz.")
    if(!normalizedEmail) errors.email.push("Email alanı boş olamaz.")    
    if(!password) {
        errors.password.push("Parola alanı boş olamaz.")
    } else if( password.length < 8 ) {
        errors.password.push("Parola en az 8 karakter olmalı.")
    }

    if ( errors.name.length || errors.email.length || errors.password.length ) {
        const err: any = new Error("Validation error");
        err.status= 400;
        err.details = errors;
        throw err;
    }



    const exists = await User.findOne({ email: normalizedEmail }).lean().exec();
    if (exists) {
        const err: any = new Error("Email already in use");
        err.status = 409;
        throw err;
    }

    const ROUNDS = 10;
    const passwordHash = await bcrypt.hash(password, ROUNDS);
    
    const user = new User ({ name: normalizedName, email: normalizedEmail, password: passwordHash});
    let saved;
    try { 
        saved = await user.save();
    } catch (e: any) {
        if(e?.code === 11000){
            const err: any = new Error("Email already in use.");
            err.status = 409;
            throw err;
        }

        const err: any = new Error("Internal error.");
        err.status = 500;
        throw err;
    }


    return {
        user: {
            id: saved.id,
            name: saved.name,
            email: saved.email,
        }
    }
}

export async function login(email:string, password:string) { 
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).lean({ virtuals: true }).exec();

    if(!user) {
        const err: any = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const ok = await bcrypt.compare(password, user.password);
    if(!ok) {
        const err: any = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
    const payload = { id: user.id, email: user.email};
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }, token
    }

}