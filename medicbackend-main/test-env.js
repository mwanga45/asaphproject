const path = require('path');
const fs = require('fs');

console.log("Testing dotenv configuration:");
console.log("Current working directory:", process.cwd());
console.log("Looking for .env file at:", path.join(process.cwd(), '.env'));

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    console.log(".env file exists");
    console.log("File size:", fs.statSync(envPath).size, "bytes");
} else {
    console.log(".env file does not exist");
}

// Try loading with explicit path
require('dotenv').config({ path: envPath });

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME); 