import express from "express";
const router = express.Router();
// import login from "../../client/pages/login.js";

//middleware 
import { requireSignIn } from "../middlewares";
//controller
import { register, login, currentUser, forgotPassword, profileUpdate, findPeople, addfollower, userFollow, removeFollower, userUnfollow, userFollowing } from '../controllers/auth.js'
// router.get();

// router.post();

// router.post("/register", (req,res) => {
//     console.log('register endpoint --> ',req.body);
// })
router.post('/register',register);
router.post('/login',login);
router.get('/current-user',requireSignIn,currentUser);
router.post('/forgot-password',forgotPassword);
router.put('/profile-update',requireSignIn,profileUpdate);
router.get('/find-people',requireSignIn,findPeople);
router.put('/user-follow',requireSignIn,addfollower,userFollow);
router.get('/user-following',requireSignIn,userFollowing);
router.put('/user-unfollow',requireSignIn,removeFollower,userUnfollow);

// router.post('/create-post',createPost);


module.exports = router;
