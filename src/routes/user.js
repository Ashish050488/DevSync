const  express =  require('express');
const { userAuth } = require('../middlewares/Auth');
const ConnectionRequest = require('../models/connectionRequest')
const userRouter = express.Router();

userRouter.get('/user/requests/received',userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status:'interested'
        }).populate('fromUserId'  ,  "firstName lastName photoUrl age gender about skills");
        // .populate('fromUserId',['firstName','lastName']);   -> both populate is same but in string it is seperated by space

        res.json({
            data : connectionRequests
        })
    } catch (err) {
        res.statusCode(400).send('Error : ' + err.message)
    }
})

module.exports = userRouter