"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const feedbackSchema = zod_1.z.object({
    correctCharacter: zod_1.z.string().min(1),
    predictedCharacter: zod_1.z.string().min(1),
    imageData: zod_1.z.string().min(1) // Base64 string
});
router.post('/feedback', async (req, res) => {
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
    }
    catch (error) {
        console.error('Error saving feedback:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
// Route for the Python script to download new training data
router.get('/feedback/download', async (req, res) => {
    try {
        const newFeedback = await prisma.feedback.findMany({
            where: { processed: false }
        });
        res.json(newFeedback);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});
// Route to mark records as processed
router.post('/feedback/mark-processed', async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark feedback as processed' });
    }
});
exports.default = router;
