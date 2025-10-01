const express = require('express');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');


const User = require('../models/user');
const { userAuth } = require('../middlewares/Auth');




const authRouter = express.Router();

// In your authRouter.js file

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignupData(req);

    const { emailId } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).json({ message: emailId + ' is already registered' });
    }

    const user = new User(req.body);
    await user.save();

    // --- START: ADD THIS LOGIN LOGIC ---

    // 1. Get the token for the new user
    const token = await user.getJwt();

    // 2. Set the token in an httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS)
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    // ---  END: ADD THIS LOGIN LOGIC  ---

    const userToReturn = user.toObject();
    delete userToReturn.password;

    res.status(201).json({
      message: 'User registered and logged in successfully!',
      user: userToReturn,
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post('/login', async (req,res)=>{
    try {
        const {emailId,password} = req.body;
    
        //  blank field check
        if(!emailId || !password){
            return res.status(400).send('Email and password is required')
        }
    
        //  find user
        const user = await User.findOne({emailId});
        if(!user){
            return res.status(400).send('user does not exist')
        }
    
       
        // comparing passwrord
        isPasswordValid = await user.validatePassword(password)
            if(!isPasswordValid) {
                return res.status(400).send('Password is not correct')
            }
           if (isPasswordValid) {
  const token = await user.getJwt();
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // ⚠️ set to true in production with HTTPS
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  res.status(201).json({
    token,
    user,
  });
}
    } catch (error) {
        return res.status(500).send('Login Failed ' + error.message)
    }
});

authRouter.post('/logout', async (req,res)=>{
   await    res
    .cookie('token',null,{
        expires:new Date(Date.now())
    })
    .send('Logged out')
})

authRouter.patch('/profile/password',userAuth, async (req,res)=>{
  try {
    const LoggedInUser = req.user 
    if(!req.body){
        throw new Error('cannot update empty field')
    }
    if(req.body.password){
        LoggedInUser.password = req.body.password
        await LoggedInUser.save();
    }
    const {password,...safeUser} = LoggedInUser.toObject();
    res.json({
        message:'password updated successfully',
        data:safeUser
    })
  } catch (err) {
    res.status(400).send('Error ' + err.message)
  }
})


module.exports = authRouter