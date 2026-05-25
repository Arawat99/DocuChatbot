import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import * as repo from "./auth.repository.js"

export const signup = async (username: string, email: string, password: string) => {
    const existingUser = await repo.findUserbyEmail(email);
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await repo.createUser(username, email, hashedPassword);

    const token = jwt.sign({ 
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email
    },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    )
    return { token, message: "Account created successfully" };
}



export const login = async (email: string, password: string) => {
    const user = await repo.findUserbyEmail(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ 
          userId: user.id,
          username: user.username,
          email: user.email
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );
    return { token, message: "Login successful" };
}