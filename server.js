const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const cookieparser = require('cookie-parser');
const errorHandler = require('./middlewares/error');
//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
dotenv.config({ path: './config.env' });

//DB connection
connectDB();

const app = express();
app.use(express.json());

//Cookie parser
app.use(cookieparser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//File uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`app listening on ${process.env.NODE_ENV} mode port ${PORT}`);
});

//Handle unhandled promise rejection

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`);
  server.close(() => process.exit(1));
});
