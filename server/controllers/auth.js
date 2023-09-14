import User from "../models/user";
import { hashPassword, comparePsw } from "../helpers/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    // console.log('register endpoint --> ',req.body);
    const { name, email, age, psw, secret } = req.body;
    console.log('--->', req.body);
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
    const user = new User({ name, email, psw: hashedPassword, secret })
    try {
        await user.save();
        // console.log('saved:--->',user);
        return res.json({
            ok: true,
        })
    } catch (e) {
        console.log('ERr:--->', e);
        res.status(400).send('Try again');
    }
}

export const login = async (req, res) => {
    try {
        // console.log('-->res:',req.body);
        //check if data base has user with email
        const { email, psw } = req.body;
        const user = await User.findOne({ email });
        if (!user){
            return res.json({
                error:"User not found.",
            })
        }
        //check for psw
        const matchPsw = await comparePsw(psw, user.psw);
        if (!matchPsw){
            return res.json({
                error:"Password is incorrect.",
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
        console.log('---xx', error);
        return res.status(400, 'Error, Try again !')
    }
}

export const currentUser = async (req, res) => {
    // console.log('-->',req.auth);
    try {
        const user = await User.findById(req.auth._id);
        res.json({ ok: "true" })
    } catch (error) {
        console.log('error--->', error);
        res.sendStatus(400);
    }
}

export const forgotPassword = async (req, res) => {
    console.log('-->', req.body);
    const { email, newPsw, secret } = req.body;
    console.log('--->',email,newPsw.length,secret);
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
    console.log('found user details: ',user);
    if (!user) {
        return res.json({
            error: "We can't verify, you provided wrong details",
        })
    }
    try {
        const hashed = await hashPassword(newPsw);
        let getRes = await User.findByIdAndUpdate(user._id, { psw: hashed });
        console.log('---res:---',getRes);
        return res.json({
            success: "Congrats, password successfully updated"
        })
    } catch (error) {
        console.log('-->', error);
    }
}


