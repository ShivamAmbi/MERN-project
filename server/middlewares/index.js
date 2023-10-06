import { expressjwt } from "express-jwt";
import Post from "../models/post";

export const requireSignIn = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms:['HS256'],
})

export const canEditDelete = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        let postedById = post.postedBy._id
        postedById = JSON.stringify(postedById).split('"').join('');
        
        if(req.auth._id != postedById){
            console.log('unauth:',req.auth._id,postedById);
            return res.status(400).send("unauthorized");
        }else{
            console.log('success:',req.auth._id,postedById);
            next();
        }
    } catch (error) {
        console.log('err:',error);
    }
}