import express from "express";
import formidable from 'express-formidable'
const router = express.Router();

//middleware 
import { canEditDelete, requireSignIn } from "../middlewares";
//controller
import { 

 } from '../controllers/auth.js'
import { createPost, editUserPost, postsByUser, updatePost, uploadImage } from "../controllers/post";

router.post('/create-post',requireSignIn,createPost);
router.post('/upload-image',requireSignIn,formidable({maxFileSize: 10 * 1024 * 1024 }),uploadImage);
router.get('/user-posts',requireSignIn,postsByUser);
router.get('/user-post/:id',requireSignIn, editUserPost);
router.put('/update-post/:id',requireSignIn,canEditDelete,updatePost);

module.exports = router;
