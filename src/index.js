import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

const port = process.env.PORT || 8000;

dotenv.config();

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('Error: ', error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed ', err);
  });
