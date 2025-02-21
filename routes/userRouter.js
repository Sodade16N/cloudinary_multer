const { register, getOneUser, getAllUser,update, deleteUser} = require('../controllers/userController');
const upload = require('../utils/multer');
const router = require('express').Router();

router.post('/register', upload.single('profilePic'), register)
router.get('/user/:id', upload.single('profilePic'), getOneUser)
router.get('/user', upload.single('profilePic'), getAllUser)
router.put('/user/:id', upload.single('profilePic'), update)
router.delete('/user/:id', deleteUser)


module.exports = router;