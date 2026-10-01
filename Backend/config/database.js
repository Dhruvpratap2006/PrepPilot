const dns = require('dns');
// Windows systems sometimes fail to resolve MongoDB SRV DNS records,
// so use Google public DNS only on Windows, keeping host DNS on Linux/production
if (process.platform === 'win32') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to DB")
    } catch(err) {
        console.error("Failed to connect to DB:", err.message);
        process.exit(1);
    }
}

module.exports = connectToDB;