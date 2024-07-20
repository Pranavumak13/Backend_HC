import {app} from './app.js';
import dotenv from 'dotenv';
import connectDB from './db/index.js';

// to config the .env file.
dotenv.config({
  path: './.env',
});
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...........`);
    });
  })
  .catch(err => {
    console.log('MongoDB Connection error', err);
  });
