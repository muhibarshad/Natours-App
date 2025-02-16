const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
process.on('uncaughtException', (err) => {
  console.error(`${err.name} and ${err.message}`);
  // console.log(err);
  console.log('Uncaught Exception : Shutting Down');
  process.exit(1);
});
dotenv.config({
  path: './config.env',
});
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect('mongodb://localhost:27017/Natours-App', {
  // .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected Successfully');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});
process.on('unhandledRejection', (err) => {
  console.error(err.name + ' ' + err.message);
  console.log('Unhandled Rejection : Shutting Down');
  server.close(() => {
    process.exit(1);
  });
});
