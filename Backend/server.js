// here we are going to write our servers

require('dotenv').config(); // Load environment variables from .env


const app = require('./src/app.js');
// here we are connecting to our DB 
// whose path is ./config/database.js
const connectToDB = require('./config/database.js');

connectToDB(); // function to connect with dataBase 


// this is the port on which our server will listen the
// the incoming request  
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});