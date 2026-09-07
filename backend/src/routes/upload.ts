import { Router, Request, Response } from 'express';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Zod schema to validate request
const uploadSchema = z.object({
  file: z.object({
    buffer: z.any(),
    originalname: z.string(),
    mimetype: z.string(),
    size: z.number().max(5 * 1024 * 1024, 'File too large'),
  }, { message: "File is required" }),
});

router.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image uploaded' });
      return;
    }

    uploadSchema.parse({ file: req.file });
    const file = req.file;

    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    const mlResponse = await axios.post(`${mlServiceUrl}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const predictedClass = mlResponse.data.predicted_class;

    if (!predictedClass) {
      res.status(500).json({ error: 'Prediction failed in ML microservice' });
      return;
    }

    const character = await prisma.character.findUnique({
      where: {
        name: predictedClass,
      },
    });

    if (!character) {
      res.status(404).json({
        error: 'Character not found in database',
        predictedClass,
      });
      return;
    }

    res.json({
      message: 'Prediction successful',
      character,
    });
  } catch (error: any) {
    console.error('Error during upload/prediction:', error.message || error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as any).errors });
    } else if (error.response?.status === 429) {
      res.status(503).json({
        error: 'The ML microservice is rate-limited or sleeping on Render free tier. Please try again in a minute or run locally.'
      });
    } else {
      res.status(500).json({ error: 'Internal server error', details: error.response?.data || error.message });
    }
  }
});

export default router;
