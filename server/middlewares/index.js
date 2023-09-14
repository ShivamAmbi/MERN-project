import { expressjwt } from "express-jwt";
import Post from "../models/post";

export const requireSignIn = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms:['HS256'],
})

export const canEditDelete = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        const postedById = post.postedBy._id
        
        if(req.auth._id != JSON.stringify(postedById).split('"').join('')){
            console.log('unauth:',req.auth._id,JSON.stringify(postedById).split('"').join(''));
            return res.status(400).send("unauthorized");
        }else{
            console.log('success:',req.auth._id,JSON.stringify(postedById).split('"').join(''));
            next();
        }
    } catch (error) {
        console.log('err:',error);
    }
}