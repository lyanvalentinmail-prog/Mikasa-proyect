import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '@mikasa/config';
import { UserRepository, BotRepository } from '@mikasa/database';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      const existing = UserRepository.findByEmail(email);
      if (existing) {
        res.status(409).json({ success: false, error: 'El correo electrónico ya está registrado.' });
        return;
      }

      const user = UserRepository.create({ email, password, name });
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: { token, user },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = UserRepository.findByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
        return;
      }

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const userWithoutPassword = UserRepository.findById(user.id);

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: { token, user: userWithoutPassword },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'No autenticado' });
        return;
      }

      const bots = BotRepository.findByUserId(req.user.id);

      res.status(200).json({
        success: true,
        data: {
          user: req.user,
          botsCount: bots.length,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
