import type { Request, Response } from 'express';

import * as authService from './auth.service.js';

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const result = await authService.signup(username, email, password);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}