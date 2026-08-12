import express from 'express';
import cors from 'cors';
import uploadRoute from './routes/upload';
import feedbackRoute from './routes/feedback';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api', uploadRoute);
app.use('/api', feedbackRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
