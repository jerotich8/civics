const db = require('../config/database');



exports.postDiscussion = async(req,res) =>{
    const {title, content} = req.body;
    const user_id = req.user.id;



    try {
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const [rows] = await db.execute (
            `INSERT INTO posts(user_id,title,content) VALUES(?,?,?)`,
            [user_id,title,content]
        );

        res.status(200).json({
            message: 'Discussion posted successfully',
            id: rows.insertId,
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting discussion' });
    }
}

exports.getDiscussions = async(req,res) => {

    try {
        const query = 'SELECT * FROM posts';
        const [rows] = await db.execute(query);
    
        if (rows.length === 0) {
          return res.status(404).json({ message: 'No Discussions found.' });
        }

    
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;


    try {
       
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        const [rows] = await db.execute('SELECT content FROM comments WHERE post_id = ?', [postId]);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};

exports.postComments = async(req,res) =>{
    const {postId, content} = req.body;
    const user_id = req.user.id;
    const created_at = new Date();

    console.log("Received post_id:", postId);
    console.log("Received content:", content);
    console.log("time stamp:",created_at)
    

    try {
        const [rows] = await db.execute (
            `INSERT INTO comments (user_id,post_id,content,created_at) VALUES(?,?,?,?)`,
            [user_id,postId,content,created_at]
        );

        res.status(200).json({
            success: true,
            message: 'Discussion posted successfully',
            content: content,
            created_at: created_at.toISOString(),
          
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting comment' });
    }
};

