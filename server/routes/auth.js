import express from "express";
const router = express.Router();
// import login from "../../client/pages/login.js";

//middleware 
import { requireSignIn } from "../middlewares";
//controller
import { register, login, currentUser } from '../controllers/auth.js'
// router.get();

// router.post();

// router.post("/register", (req,res) => {
//     console.log('register endpoint --> ',req.body);
// })
router.post('/register',register);
router.post('/login',login);
router.get('/current-user',requireSignIn,currentUser)

module.exports = router;
