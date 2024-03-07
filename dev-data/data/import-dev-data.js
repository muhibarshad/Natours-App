const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('../../model/tourModel');

dotenv.config({
  path: './config.env',
});
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    // .connect('mongodb://localhost:27017/Natours-App', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connected Successfully'));

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully in database');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported Successfully in database');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--import') {
  importData();
} else {
  console.log('Please Specify the method');
}
