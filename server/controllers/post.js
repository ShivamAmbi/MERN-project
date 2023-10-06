import User from "../models/user";
import Post from "../models/post";
import cloudinary from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

export const createPost = async (req, res) => {
    const { content, image, user_id } = req.body;
    if (!content.length) {
        return res.json({
            error: "Comment is required and cannot be empty."
        })
    }
    try {
        const post = new Post({ content, image, postedBy: user_id });
        post.save();
        res.json({ post })
    } catch (error) {
        console.log('err--->', error);
        res.sendStatus(400);
    }
}

export const uploadImage = async (req, res) => {
    // console.log('---->',req.files);
    try {
        const result = await cloudinary.uploader.upload(req.files.image.path);
        // console.log('img url---->',result);
        res.json({
            url: result.secure_url,
            public_id: result.public_id,
        })
    } catch (error) {
        console.log('err:', error);
    }
}

export const postsByUser = async (req, res) => {
    try {
        const posts = await Post.find().populate(    // {postedBy: req.auth._id}
            'postedBy',
            '_id name image').sort({ createdAt: -1 }).limit(10);
        res.json(posts);
    } catch (error) {
        console.log('postsByUser err->', error);
        res.json(error)
    }
}

export const editUserPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate('postedBy', '_id name image')
        .populate('comments.postedBy', '_id name image');
        res.json(post);
    } catch (error) {
        console.log('error:', error);
    }
}

export const updatePost = async (req, res) => {
    try {
        console.log('updatePost:', req.body);
        try {
            const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            });
            res.json(post);
        } catch (error) {
            console.log('error:', error);
        }
    } catch (error) {
        console.log('err:', error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        console.log('deleting post:', post);
        //removing image from cloudinary
        if (post.image && post.image.public_id) {
            const image = await cloudinary.uploader.destroy(post.image.public_id);

        }
        res.json({ ok: true });
    } catch (error) {
        console.log('err:', error);
    }
}

export const newsFeed = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        let following = user.following;
        following.push(req.auth._id);

        const posts = await Post.find({ postedBy: { $in: following } })
            .populate('postedBy', '_id name image')
            .populate('comments.postedBy', '_id name image')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(posts);
    } catch (error) {
        console.log('err:', error);
    }
}

export const likePost = async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.body._id,{
            $addToSet: {likes: req.auth._id}    
        },{ new: true });
        res.json(post);
    } catch (error) {
        console.log('err:', error);
    }
}

export const unlikePost = async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.body._id,{
            $pull: {likes: req.auth._id}    
        },{ new: true });
        res.json(post);  
    } catch (error) {
        console.log('err:', error);
    }
}
export const addComment = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comments: { text: comment, postedBy: req.auth._id } },
        }, { new: true })
        .populate('postedBy', '_id name image')
        .populate('comments.postedBy', '_id name image');
        res.json(post);
    } catch (error) {
        console.log('err:', error);
    }
}

export const removeComment = async (req,res) => {
    try {
        const { postId, comment } = req.body;
        console.log('--xxxxx--->',postId,'/n',comment,'/n',req.auth._id);
        const post = await Post.findByIdAndUpdate(postId, {
            $pull: { comments: { _id: comment._id } },
        }, { new: true });
        res.json(post);
    } catch (error) {
        console.log('err:', error);
    }
}
