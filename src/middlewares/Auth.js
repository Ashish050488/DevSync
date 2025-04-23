const jwt = require('jsonwebtoken');
const User =  require('../models/user');

const userAuth = async (req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error('token is not valid');
        }
        const decodedObj = await jwt.verify(token,'Dev@sync01',);
        const {_id} = decodedObj;
        const user =  await User.findOne({_id});
        if(!user){
            throw new Error ('User not found')
        }

        req.user = user
        next()
    } catch (err) {
        res.status(400).send('Error '+ err.message)
    }
}

module.exports = {
    userAuth
}