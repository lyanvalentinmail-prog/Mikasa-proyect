import { Router } from 'express';
import { UploadController } from '../controllers/uploadController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, UploadController.uploadImage);

export default router;
