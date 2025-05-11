const express = require('express');
const mongoose = require('mongoose');

const requestRouter = express.Router();

const {userAuth} =   require('../middlewares/Auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {

    try {
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;
        const allowedStatus =  ['ignored','interested'];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:'Invalid status type ' + status
            })
        }

        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const toUser =  await User.findById(toUserId);
        if(!toUser){     
            return res.status(404).json({message:'User Not Found'})
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
               { toUserId,fromUserId,},
               {toUserId:fromUserId,fromUserId:toUserId}
            ]
        })

        if(existingConnectionRequest){
            throw new Error('There is already a Connection request from ' + fromUserId.firstName)
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,toUserId,status
        })
        const data = await connectionRequest.save()
        res.send({
            message: `${req.user.firstName} has ${status === 'interested' ? 'shown interest in' : 'ignored'} you.`,
            data 
        })


    } catch (error) {
        res.status(400).send('Error ' + error.message)
    }


})


 requestRouter.post('/request/review/:status/:requestId',userAuth, async (req,res)=>{
        try {

            const loggedInUser = req.user;
            const {status,requestId} = req.params;
            const allowedStatus = ['accepted','rejected'];
            if(!allowedStatus.includes(status)){
                return res.status(400).json({
                    message:'Status not allowed'
                })
            };

 
          
            const connectionRequest = await ConnectionRequest.findOne({
                _id:requestId,
                toUserId:loggedInUser._id,
                status:'interested'.trim()
                
            }); 
            

            if(!connectionRequest){
                return res.status(400).json({
                    message:'Connection request not found'
                })
            }

            connectionRequest.status = status;
            const data = await connectionRequest.save();
            res.json({
                message:'Connection Request ' + status,
                data:data 
            })


        } catch (err) {
            res.status(400).json({
                message: 'Error in request review' + err.message
            })
        }
    })



    


module.exports =  requestRouter



