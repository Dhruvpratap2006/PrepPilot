// here we are going to write our servers

require('dotenv').config(); // we are using dotenv to load 
// environment variables from a .env file into process.env


const app = require('./src/app.js');
const connectToDB = require('./config/database.js');

connectToDB(); // here we have call the function to start the server

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

