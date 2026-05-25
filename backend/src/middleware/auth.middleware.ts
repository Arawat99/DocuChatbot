import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    account?: {
        id: string;
        email: string;
    };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { accountId: string; email: string };
        req.account = { id: decoded.accountId, email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;