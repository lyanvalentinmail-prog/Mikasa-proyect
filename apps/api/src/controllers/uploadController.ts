import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export class UploadController {
  public static async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const { dataUrl, filename } = req.body;

      if (!dataUrl) {
        res.status(400).json({ success: false, error: 'dataUrl requerido para la imagen' });
        return;
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        res.status(400).json({ success: false, error: 'Formato dataURL base64 inválido' });
        return;
      }

      const ext = matches[1].split('/')[1] || 'png';
      const buffer = Buffer.from(matches[2], 'base64');
      const safeName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = path.resolve(process.cwd(), './uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeName}`;

      res.status(200).json({
        success: true,
        message: 'Archivo subido exitosamente',
        data: { url: publicUrl, filename: safeName },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
