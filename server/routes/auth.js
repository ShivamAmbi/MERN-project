import express from "express";
const router = express.Router();
// import login from "../../client/pages/login.js";

//controller
import { register, login } from '../controllers/auth.js'
// router.get();

// router.post();

// router.post("/register", (req,res) => {
//     console.log('register endpoint --> ',req.body);
// })
router.post('/register',register);
router.post('/login',login);

module.exports = router;
