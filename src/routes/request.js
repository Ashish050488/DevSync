const express = require('express');

const requestRouter = express.Router();

const {userAuth} =   require('../middlewares/Auth')

requestRouter.post('/request/send/interested/:toUserId' , userAuth, async (req,res)=>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId

    } catch (error) {
        res.status(400).send('Error '+ error.message)
    }
    

})


module.exports =  requestRouter



