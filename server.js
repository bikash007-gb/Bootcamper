const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
//Route files
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config.env' });

//DB connection
connectDB();

const app = express();
app.use(express.json());
//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`app listening on ${process.env.NODE_ENV} mode port ${PORT}`);
});

//Handle unhandled promise rejection

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`);
  server.close(() => process.exit(1));
});
