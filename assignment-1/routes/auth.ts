import jwt from "jsonwebtoken";
import express from 'express';
import {authenticateJwt, SECRET} from "../middleware/";
import {User} from "../db";

const router = express.Router();
// import {z} from 'zod';
import {signInput} from '@sushil09/common';

//creating the schema for zod validation
// const signInput = z.object({
//     username: z.string().email({message: "Invalid email address"}),
//     password: z.string().min(6)
// })

// type SignUpParams=z.infer<typeof signInput>;
router.post('/signup', async (req, res) => {
    const parsedInput = signInput.safeParse(req.body);
    // const { username, password } = payload;
    if (!parsedInput.success) {
        return res.status(411).json({msg: parsedInput.error});
    }
    let username = parsedInput.data.username;
    let password = parsedInput.data.password;
    const user = await User.findOne({username});
    if (user) {
        res.status(403).json({message: 'User already exists'});
    } else {
        const newUser = new User({username, password});
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, SECRET, {expiresIn: '1h'});
        res.json({message: 'User created successfully', token});
    }
});

router.post('/login', async (req, res) => {
  const parsedInput = signInput.safeParse(req.body);
  // const { username, password } = payload;
  if (!parsedInput.success) {
    return res.status(411).json({msg: parsedInput.error});
  }
  let username = parsedInput.data.username;
  let password = parsedInput.data.password;
    const user = await User.findOne({username, password});
    if (user) {
        const token = jwt.sign({id: user._id}, SECRET, {expiresIn: '1h'});
        res.json({message: 'Logged in successfully', token});
    } else {
        res.status(403).json({message: 'Invalid username or password'});
    }
});

router.get('/me', authenticateJwt, async (req, res) => {
    const user = await User.findOne({_id: req.header('user-id')});
    if (user) {
        res.json({username: user.username});
    } else {
        res.status(403).json({message: 'User not logged in'});
    }
});

export default router;
