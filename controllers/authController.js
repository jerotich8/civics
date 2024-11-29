const db = require('../config/database')
const bcrypt= require ('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.registerUser = async (req,res) => {
    const { email,password,user_name} = req.body;

    try{
        const [rows] = await db.execute ('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0){
            return res.status(400).json ({message:'User already exists'});
        }
        //hash password
        const password_hash = await bcrypt.hash(password,10);

        //insert user into database
        await db.execute(
            'INSERT INTO users (user_name, email, password_hash) VALUES (?, ?, ?)',
            [user_name, email, password_hash]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
}

exports.loginUser = async (req,res) => {
    try {
        const { email, password } = req.body;
        
        
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'User not found! Please register.' });
        }
        
        const user = rows[0];

        // Check if the password is valid using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token after successful login
        const token = jwt.sign(
            {
                id: user.user_id,
                user_name: user.user_name,
                email: user.email,
            },
            SECRET_KEY, // Secret key for signing the token
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token back to the client
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token, // Send JWT token to client
            user: { // Optionally, send some patient info
                id: user.user_id,
                user_name: user.user_name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
}

exports.getProfile = (req,res) =>{
    
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    res.json({
        message: 'Profile fetched successfully',
        user: req.user
    });
}