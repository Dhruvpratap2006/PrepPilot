const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Fix: Windows systems sometimes fail to resolve MongoDB's SRV DNS records 
// (mongodb+srv:// connection strings), causing "querySrv ECONNREFUSED" error.
// Forcing Google's public DNS servers here fixes this resolution issue.
// Same fix used earlier in Roamio project for the same error.

const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to DB")
    } catch(err) {
        console.log(err);
    }
}

module.exports = connectToDB;