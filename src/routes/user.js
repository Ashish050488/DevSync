const  express =  require('express');
const { userAuth } = require('../middlewares/Auth');
const ConnectionRequest = require('../models/connectionRequest')
const userRouter = express.Router();
const User = require('../models/user')


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get('/user/requests/received',userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status:'interested'
        }).populate('fromUserId'  ,  USER_SAFE_DATA);
        // .populate('fromUserId',['firstName','lastName']);   -> both populate is same but in string it is seperated by space

        res.json({
            data : connectionRequests
        })
    } catch (err) {
        res.statusCode(400).send('Error : ' + err.message)
    }
})

userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:'accepted'},
                {fromUserId:loggedInUser._id,status:'accepted'}
            ]
        })
        .populate('fromUserId',USER_SAFE_DATA)
        .populate('toUserId',USER_SAFE_DATA);




        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }else{
                return row.fromUserId;
            }
        })
        res.json({
            message:'Connection fetched successfully',
            data:data
        })
    } catch (err) {
        res.status(400).json({
            message:'Error in getting connections',
            err:err.message
        })
    }
})



userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50?50:limit;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [{
                fromUserId: loggedInUser._id
            }, {
                toUserId: loggedInUser._id
            }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.toUserId.toString()),
                hideUsersFromFeed.add(req.fromUserId.toString())
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)
        res.json({
            data: users
        })

    } catch (err) {
        res.status(400).json({
            err: err.message
        })
    }
})

module.exports = userRouter