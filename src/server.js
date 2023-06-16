const mongoose = require('mongoose');
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! -------- Shutting Down...');
  process.exit(1);
})

dotenv.config({ path: './config.env'});
const app = require('./app');

// console.log(process.env);
// console.log(process.env.PORT);
const DB = process.env.DATABASE.replace('<PASSWORD>',
 process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
}).then(con => {
  console.log('DB Connection successful!');
})

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});


// Unhandled Rejections
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! -------- Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});

