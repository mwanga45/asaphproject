require("dotenv").config();
const { Pool } = require("pg");

// Debug environment variables
console.log("=== Database Environment Variables Debug ===");
console.log("DB_USER:", process.env.DB_USER, "Type:", typeof process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD, "Type:", typeof process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST, "Type:", typeof process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT, "Type:", typeof process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME, "Type:", typeof process.env.DB_NAME);
console.log("===========================================");

// Ensure all database configuration values are properly set
const dbConfig = {
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT) || 5432,
  password: String(process.env.DB_PASSWORD || ""), // Ensure password is always a string
  host: process.env.DB_HOST,
};

// Validate required environment variables
if (!dbConfig.user || !dbConfig.password || !dbConfig.host || !dbConfig.database) {
  console.error("Missing required database environment variables:");
  console.error("DB_USER:", !!dbConfig.user);
  console.error("DB_PASSWORD:", !!dbConfig.password);
  console.error("DB_HOST:", !!dbConfig.host);
  console.error("DB_NAME:", !!dbConfig.database);
  throw new Error("Missing required database environment variables");
}

const pool = new Pool(dbConfig);
const databaseName = process.env.DB_NAME;

async function createDatabaseIfNotExist() {
  const defaultPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "postgres",
    password: String(process.env.DB_PASSWORD || ""), // Ensure password is always a string
    port: parseInt(process.env.DB_PORT) || 5432,
  });
  
  try {
    const query = `SELECT 1 FROM pg_database WHERE datname = $1`;
    const result = await defaultPool.query(query, [databaseName]);

    if (result.rows.length === 0) {
      await defaultPool.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Database ${databaseName} created successfully`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (err) {
    if (err.code !== "42P04") {
      console.error("Database error:", err);
    }
  } finally {
    await defaultPool.end();
  }
}

async function initializeConnection() {
  await createDatabaseIfNotExist();
  const client = await pool.connect();

  try {
    // Users table
    const userTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(250) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL,
        email VARCHAR(250) NOT NULL UNIQUE,
        phone VARCHAR(20),
        address TEXT,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await client.query(userTable);
    console.log("Users table initialized successfully");
    const specialist = `CREATE TABLE IF NOT EXISTS specialist(
    id SERIAL PRIMARY KEY,
    specialist VARCHAR(200) NOT NULL UNIQUE,
    specialistInfo VARCHAR(200) NOT NULL
    )`;
    await client.query(specialist);
    console.log("Specialist table initialize");
    // Doctors table
    const doctorTable = `
      CREATE TABLE IF NOT EXISTS doctors (
  id               SERIAL PRIMARY KEY,
  doctorname       VARCHAR(250) NOT NULL UNIQUE,
  password         VARCHAR(250) NOT NULL,
  email            VARCHAR(250) NOT NULL UNIQUE,
  specialist_name  VARCHAR(200),
  phone            VARCHAR(20),
  working_id       VARCHAR(250) NOT NULL UNIQUE,
  role             VARCHAR(20) DEFAULT 'dkt',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_specialist_name
    FOREIGN KEY (specialist_name)
    REFERENCES specialist(specialist)
    ON UPDATE CASCADE
    ON DELETE SET NULL
      )
    `;
    await client.query(doctorTable);
    console.log("Doctors table initialized");
    // specilistTable

    // Doctor working hours table
    const doctorWorkingHoursTable = `
      CREATE TABLE IF NOT EXISTS doctor_working_hours (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id),
        day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await client.query(doctorWorkingHoursTable);
    console.log("Doctor working hours table initialized");

    // Services table
    const serviceTable = `
      CREATE TABLE IF NOT EXISTS service_tb (
        id SERIAL PRIMARY KEY,
        servicename VARCHAR(250) NOT NULL UNIQUE,
        duration_minutes INTEGER NOT NULL,
        fee DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await client.query(serviceTable);
    console.log("Service table initialized");

    
    const doctorServicesTable = `
      CREATE TABLE IF NOT EXISTS doctor_services (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id),
        service_id INTEGER REFERENCES service_tb(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await client.query(doctorServicesTable);
    console.log("Doctor services table initialized");


    const bookingTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        doctor_id INTEGER REFERENCES doctors(id),
        service_id INTEGER REFERENCES service_tb(id),
        day_of_week INTEGER NOT NULL,
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        
      )
    `; 
    await client.query(bookingTable);
    console.log("bookings table initialized");


    console.log("Bookings table initialized");
    const AdmTb = `CREATE TABLE IF NOT EXISTS adm_tb(
    id SERIAL PRIMARY KEY,
    username VARCHAR(200),
    password VARCHAR(200),
    role VARCHAR(20) DEFAULT 'adm'
    )`
    await client.query(AdmTb)
    console.log("AdmTb is created")
  } catch (err) {
    console.error("Error during database initialization:", err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  initializeConnection,
};
