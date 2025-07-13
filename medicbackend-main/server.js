require('dotenv').config();

// Debug environment variables loading
console.log("Environment variables loaded:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SERVER_PORT:", process.env.SERVER_PORT);

const http = require('http'); // Import http module
const express = require("express");
const cors = require("cors");
const { initializeConnection } = require("./dbconn/db");
// const bookingRoutes = require('./routes/bookingRoutes');
const routes = require('./routes/serviceRouter')
const PORT = process.env.SERVER_PORT || 8200;
const setupVideoChart = require("./videochart/videochart")

const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create HTTP server
const server = http.createServer(app); 


const initializeApp = async () => {
    try {
        await initializeConnection();
        console.log("Database initialized successfully");

        
        setupVideoChart(server); 

        // Routes
        app.use("/api/service", routes);
        
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({
                success: false,
                message: 'Something went wrong!',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        });

        // Start server
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
        process.exit(1); 
    }
};

initializeApp();