import { User } from "../models/user.model";
import bcrypt from "bcrypt";

export async function register(name: string, email: string, password: string) {
    function findByEmail(email: string){
        return User.findOne({ email }).exec();
    }
    const exists = await findByEmail(email);
    if (exists) {
        const err: any = new Error("Email already in use");
        err.status = 409;
        throw err;
    }

    const ROUNDS = 10;
    function hashPassword(p: string) {
        return bcrypt.hash(p, ROUNDS);
    }
    const passwordHash = await hashPassword(password);
    
    const user = new User ({ name, email, passwordHash});
    function createUser() {
        return user.save();
    }


    return {
        user: { id: user.id, name: user.name, email: user.email}
    }
}