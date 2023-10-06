import express from "express";
import formidable from 'express-formidable'
const router = express.Router();

//middleware 
import { canEditDelete, requireSignIn } from "../middlewares";
//controller
import { 

 } from '../controllers/auth.js'
import { createPost, deletePost, editUserPost, postsByUser, updatePost, uploadImage, newsFeed, likePost, unlikePost, addComment, removeComment } from "../controllers/post";

router.post('/create-post',requireSignIn,createPost);
router.post('/upload-image',requireSignIn,formidable({maxFileSize: 10 * 1024 * 1024 }),uploadImage);
router.get('/user-posts',requireSignIn,postsByUser);
router.get('/user-post/:id',requireSignIn, editUserPost);
router.put('/update-post/:id',requireSignIn,canEditDelete,updatePost);
router.delete('/delete-post/:id',requireSignIn,canEditDelete,deletePost);
router.get('/news-feed',requireSignIn,newsFeed);
router.put('/like-post',requireSignIn,likePost);
router.put('/unlike-post',requireSignIn,unlikePost);
router.put('/add-comment',requireSignIn,addComment);
router.put('/remove-comment',requireSignIn,removeComment);

module.exports = router;
