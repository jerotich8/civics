const express = require('express');
const jwt = require ('jsonwebtoken')
const router = express.Router();
const civicsController = require ('../controllers/civicsController');
const authenticateToken = require('../middleware/authen')

router.post('/discussions',authenticateToken,civicsController.postDiscussion);

router.get ('/discussions',civicsController.getDiscussions);

router.post('/comments',authenticateToken,civicsController.postComments);

router.get('/comments/:postId',civicsController.getCommentsByPostId);

module.exports = router;
