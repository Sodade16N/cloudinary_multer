const { createPost} = require('../controllers/postController');
const upload = require('../utils/multer');
const router = require('express').Router();

router.post('/post/:id', upload.array('images', 20), createPost);


module.exports = router;