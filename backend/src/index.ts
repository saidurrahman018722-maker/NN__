import express from 'express';
import cors from 'cors';
import uploadRoute from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', uploadRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
