import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const feedbackSchema = z.object({
  correctCharacter: z.string().min(1),
  predictedCharacter: z.string().min(1),
  imageData: z.string().min(1) // Base64 string
});

router.post('/feedback', async (req: Request, res: Response): Promise<void> => {
  try {
    const { correctCharacter, predictedCharacter, imageData } = feedbackSchema.parse(req.body);

    const feedback = await prisma.feedback.create({
      data: {
        correctCharacter,
        predictedCharacter,
        imageData
      }
    });

    res.json({ success: true, message: 'Feedback saved successfully', id: feedback.id });
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Route for the Python script to download new training data
router.get('/feedback/download', async (req: Request, res: Response): Promise<void> => {
  try {
    const newFeedback = await prisma.feedback.findMany({
      where: { processed: false }
    });
    res.json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Route to mark records as processed
router.post('/feedback/mark-processed', async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'ids must be an array' });
      return;
    }
    
    await prisma.feedback.updateMany({
      where: { id: { in: ids } },
      data: { processed: true }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark feedback as processed' });
  }
});

export default router;
