"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Configure multer to use memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    },
});
// Zod schema to validate request
const uploadSchema = zod_1.z.object({
    file: zod_1.z.object({
        buffer: zod_1.z.any(),
        originalname: zod_1.z.string(),
        mimetype: zod_1.z.string(),
        size: zod_1.z.number().max(5 * 1024 * 1024, 'File too large'),
    }, { message: "File is required" }),
});
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Validate file presence
        if (!req.file) {
            res.status(400).json({ error: 'No image uploaded' });
            return;
        }
        // Validate using Zod
        uploadSchema.parse({ file: req.file });
        const file = req.file;
        // Prepare form data to send to Python microservice
        const formData = new form_data_1.default();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        // Forward to Python microservice
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const mlResponse = await axios_1.default.post(`${mlServiceUrl}/predict`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        const predictedClass = mlResponse.data.predicted_class;
        if (!predictedClass) {
            res.status(500).json({ error: 'Prediction failed in ML microservice' });
            return;
        }
        // Query database for character details
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
    }
    catch (error) {
        console.error('Error during upload/prediction:', error.message || error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }
});
exports.default = router;
