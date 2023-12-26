const express = require('express')
const router = express.Router()
const{authUser,registerUser,allUser} =require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

router.route('/register').post(registerUser)
router.post("/login", authUser);
router.get("/",protect,allUser);

module.exports=router