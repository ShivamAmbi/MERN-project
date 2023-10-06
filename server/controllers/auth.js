import User from "../models/user";
import { hashPassword, comparePsw } from "../helpers/auth";
import jwt from "jsonwebtoken";
// const { nanoid } = require('nanoid')
import { v4 as uuidv4 } from 'uuid';


export const register = async (req, res) => {
    const { name, email, age, psw, secret } = req.body;
    //validation
    if (!name) {
        return res.json({
            error: "Name is required",
        })
    }
    if (!email) {
        return res.json({
            error: "Enter correct email / email is required",
        })
    }
    if (!age) {
        return res.json({
            error: "Enter correct age / age is required."
        })
    }
    if (!psw || psw.length < 6) {
        return res.json({
            error: "Enter correct password with length more than 6 / password is required.",
        })
    }
    if (!secret) {
        return res.json({
            error: "Enter correct answer / answer is required."
        })
    }
    const exist = await User.findOne({ email });
    if (exist) {
        return res.json({
            error: "Email already exist.",
        })
    }

    //hash password
    const hashedPassword = await hashPassword(psw);
    const user = new User({ name, email, age, psw: hashedPassword, secret, username: uuidv4() })
    try {
        await user.save();
        return res.json({
            ok: true,
        })
    } catch (e) {
        console.log('error:--->', e);
        res.status(400).send('Try again');
    }
}

export const login = async (req, res) => {
    try {
        //check if data base has user with email
        const { email, psw } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: "User not found.",
            })
        }
        //check for psw
        const matchPsw = await comparePsw(psw, user.psw);
        if (!matchPsw) {
            return res.json({
                error: "Password is incorrect.",
            })
        }
        //create a signed token
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        user.psw = undefined;
        user.secret = undefined;
        res.json({
            user, token,
        })
    } catch (error) {
        console.log('error', error);
        return res.status(400, 'Error, Try again !')
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        res.json({ ok: "true" })
    } catch (error) {
        console.log('error--->', error);
        res.sendStatus(400);
    }
}

export const forgotPassword = async (req, res) => {
    const { email, newPsw, secret } = req.body;
    if (!newPsw || newPsw < 6) {
        return res.json({
            error: 'New Password is empty or should be more than 6 characters.'
        })
    }
    if (!secret) {
        return res.json({
            error: 'Secret is required.'
        })
    }
    const user = await User.findOne({ email, secret });
    if (!user) {
        return res.json({
            error: "We can't verify, you provided wrong details",
        })
    }
    try {
        const hashed = await hashPassword(newPsw);
        let getRes = await User.findByIdAndUpdate(user._id, { psw: hashed });
        return res.json({
            success: "Congrats, password successfully updated"
        })
    } catch (error) {
        console.log('-->', error);
    }
}

export const profileUpdate = async (req, res) => {
    try {
        const data = {};
        if (req.body.userName) {
            data.username = req.body.userName;
        }
        if (req.body.about) {
            data.about = req.body.about;
        }
        if (req.body.name) {
            data.name = req.body.name;
        }
        if (req.body.age) {
            data.age = req.body.age;
        }
        if (req.body.psw) {
            if (req.body.psw.length < 6) {
                return res.json({
                    error: "Please enter password that is 6 character long",
                })
            } else {
                data.psw = await hashPassword(req.body.psw);
            }
        }
        if (req.body.secret) {
            data.secret = req.body.secret;
        }
        if (req.body.image) {
            data.image = req.body.image;
        }
        let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
        user.psw = undefined;
        user.secret = undefined;
        res.json(user);
    } catch (error) {
        if (error.code == 11000) return res.json({ error: "duplicate username." })
        console.log('err:', error);
    }
}

export const findPeople = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        let tmp = JSON.stringify(user._id).replaceAll('"', '');
        let following = user.following;
        following.push(req.auth._id);
        const people = await User.find({ _id: { $nin: following } }).select('-psw -secret').limit(10);
        res.json(people);

    } catch (error) {
        console.log('error--->', error);
    }
}
//middleware
export const addfollower = async (req, res, next) => {
    console.log('>>>>>--->>>', req);
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $addToSet: { followers: req.auth._id }
        })
        next();
    } catch (error) {
        console.log('error:', error);
    }
}

export const userFollow = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.auth._id, {
            $addToSet: { following: req.body._id }
        }, { new: true }).select('-psw -secret');
        res.json(user);
    } catch (error) {
        console.log('error:', error);
    }
}

export const userFollowing = async (req,res) => {
    try {
        const user = await User.findById(req.auth._id);
        const following = await User.find({_id:user.following}).limit(50);
        res.json(following);
    } catch (error) {
        console.log('error:', error);
    }
}
//middleware
export const removeFollower = async(req,res,next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $pull: { followers: req.auth._id }
        })
        next();
    } catch (error) {
        console.log('error:', error);
    }
}
export const userUnfollow = async(req,res) => {
    try {
        const user =  await User.findByIdAndUpdate(req.auth._id,{
            $pull: {following: req.body._id}
        },{ new: true });
        res.json(user);
    } catch (error) {
        console.log('error:', error);
    }
}