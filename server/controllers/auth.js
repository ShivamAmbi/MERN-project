import User from "../models/user";
import { hashPassword,comparePsw } from "../helpers/auth";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
    // console.log('register endpoint --> ',req.body);
    const {name,email,age,psw,secret} = req.body;
    console.log('--->',req.body);
    //validation
    if(!name) return res.status(400).send('Name is required')
    if(!email) return res.status(400).send('Enter correct email / email is required')
    if(!age) return res.status(400).send('Enter correct age / age is required,')
    if(!psw) return res.status(400).send('Enter correct password / password is required')
    if(!secret) return res.status(400).send('Enter correct answer / answer is required')

    const exist =  await User.findOne({ email});

    if(exist) return res.status(400).send('Email already exist');

    //hash password
    const hashedPassword = await hashPassword(psw);


    const user = new User({name,email,psw:hashedPassword,secret})
    
    try {
        await user.save();
        // console.log('saved:--->',user);
        return res.json({
            ok:true,
        })
    } catch (e) {
        console.log('ERr:--->',e);
        res.status(400).send('Try again');
    }

}

export const login = async (req,res) => {
    try {
        // console.log('-->res:',req.body);
//check if data base has user with email
        const { email, psw } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.status(400).send('User not found');
        //check for psw
        const matchPsw = await comparePsw(psw,user.psw);
        if(!matchPsw) return res.status(400).send('Password is incorrect')
        //create a signed token
        const token = jwt.sign({_id:user.id},process.env.JWT_SECRET,{
            expiresIn:'7d',
        });
        user.psw= undefined;
        user.secret= undefined;
        res.json({
            user,token,
        })
    } catch (error) {
        console.log('---xx',error);
        return res.status(400,'Error, Try again !')
    }
}