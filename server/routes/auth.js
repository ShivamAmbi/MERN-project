import express from "express";
const router = express.Router();
// import login from "../../client/pages/login.js";

//middleware 
import { requireSignIn } from "../middlewares";
//controller
import { register, login, currentUser, forgotPassword } from '../controllers/auth.js'
// router.get();

// router.post();

// router.post("/register", (req,res) => {
//     console.log('register endpoint --> ',req.body);
// })
router.post('/register',register);
router.post('/login',login);
router.get('/current-user',requireSignIn,currentUser)
router.post('/forgot-password',forgotPassword);

module.exports = router;
