import express from 'express';
import cors from 'cors';
import path from 'path';
import uploadRoute from './routes/upload';

const app = express();
// Hugging Face Spaces expose port 7860 by default
const PORT = process.env.PORT || 7860;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', uploadRoute);

// Serve static frontend files
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all to serve index.html for React Router (if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
