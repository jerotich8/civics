const mysql = require("mysql2/promise");
const dotenv = require ("dotenv");

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Function to create a database
const createDatabase = async () => {
    const dbName = process.env.DB_NAME;

    const createDbQuery = `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`;

    try {
        // Create the database
        
        await pool.query(createDbQuery); // Use await to handle the promise
        console.log(`Database '${dbName}' created or already exists.`);

        // Now, connect to the newly created database for table creation
        const db = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: dbName,
        });

        await createTables(db); // Call the function to create tables

    } catch (error) {
        console.error('Error creating database:', error);
    }
};


const createTables = async(db) => {
    

    const usersTable = `
        CREATE TABLE IF NOT EXISTS users(
            user_id INT PRIMARY KEY AUTO_INCREMENT,
            user_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`

    const postsTable = `
        CREATE TABLE IF NOT EXISTS posts(
            post_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            title VARCHAR(255),
            content TEXT NOT NULL,
            sentiment_score FLOAT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`

    const commentsTable =`
        CREATE TABLE IF NOT EXISTS comments(
            comment_id INT PRIMARY KEY AUTO_INCREMENT,
            post_id INT,
            user_id INT,
            content TEXT NOT NULL,
            sentiment_score FLOAT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(post_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`

    const eventsTable = `
        CREATE TABLE IF NOT EXISTS events(
            event_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            date_time DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`    

    const analysisTable = `
        CREATE TABLE IF NOT EXISTS sentiment_analysis(
            analysis_id INT PRIMARY KEY AUTO_INCREMENT,
            target_type ENUM ("post","comment") NOT NULL,
            target_id INT NOT NULL,
            sentiment ENUM("positive","neutral","negative") NOT NULL,
            confidence_score FLOAT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`

        try {
            await db.query(usersTable);
            console.log('Users table created or already exists.');
    
            await db.query(postsTable);
            console.log('Posts table created or already exists.');
    
            await db.query(commentsTable);
            console.log('Comments table created or already exists.');
    
            await db.query(eventsTable);
            console.log('Events table created or already exists.');

            await db.query(analysisTable);
            console.log('Sentiment_analysis table created or already exists.');
    
    
        } catch (error) {
            console.error('Error creating tables:', error);
    
        } 
    
    };
// Call the function to create the database
createDatabase();


module.exports = pool;