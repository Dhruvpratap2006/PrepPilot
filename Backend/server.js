// here we are going to write our servers

require('dotenv').config(); // we are using dotenv to load 
// environment variables from .env file to process.env file
// this must run before app.js is required — app.js requires the passport
// config, which reads process.env.GOOGLE_CLIENT_ID as soon as it loads,
// so the env variables need to already be in place by then


const app = require('./src/app.js');
// here we are connecting to our DB 
// whose path is ./config/database.js
const connectToDB = require('./config/database.js');

connectToDB(); // function to connect with dataBase 


// this is the port on which our server will listen the
// the incoming request  
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})