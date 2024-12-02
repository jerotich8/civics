const db = require('../config/database');


exports.addEvent = async(req,res) => {

    const { title, description, location, date_time } = req.body;
    const user_id = req.user.id;

    if (!title || !description || !location || !date_time) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Insert the event into the database
        const query = "INSERT INTO events (user_id,title, description, location, date_time) VALUES (?,?, ?, ?, ?)";
        await db.execute(query, [user_id,title, description, location, date_time]);

        res.status(200).json({ message: "Event added successfully!" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Failed to add event. Please try again later." });
    }  
};

exports.getEvents = async (req, res) => {
    try {
        // Fetch all events from the database
        const query = "SELECT title, description, location, date_time FROM events ORDER BY date_time ASC";
        const [events] = await db.execute(query);

        res.status(200).json(events); // Send the fetched events to the client
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Failed to fetch events. Please try again later." });
    }
};