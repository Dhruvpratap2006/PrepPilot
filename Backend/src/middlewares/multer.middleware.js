// we are writing the code for multer middleware here
// see the multer use in packagesUsedForReportGeneration.txt file


const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(), // temporary memory storage
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

module.exports = upload;