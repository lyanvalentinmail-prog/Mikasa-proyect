import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@mikasa/config';
import { UserRepository } from '@mikasa/database';
import { JWTPayload, User } from '@mikasa/types';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ success: false, error: 'No autorizado. Se requiere token de autenticación.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    const user = UserRepository.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ success: false, error: 'Usuario no encontrado o sesión expirada.' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token inválido o expirado.' });
  }
}
