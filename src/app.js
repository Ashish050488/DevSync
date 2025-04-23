const express = require('express');
const mongoose = require('mongoose');
const ConnectDb = require('./config/database');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser())




const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')


app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);


app.patch('/user/:userId', async (req,res)=>{
    const userId = req.params.userId;
    const data =req.body;



    try {

        
        const ALLOWED_UPDATES = [
            'lastName', 'firstName', 'photoUrl', 'about', 'gender', 'age', 'skills'
        ];

        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            res.status(400).send('update not allowed')
        }


        const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true,
        })
        console.log(user);
        res.send('user Updated successfully')
    } catch (err) {
        res.status(400).send('Udate failed : ' + err.message)
    }

})




    







ConnectDb().then(()=>{
    console.log('Db connected');
    app.listen(7777 ,()=>{
        console.log('server connected');
    })
}).catch((err) =>{
    console.error('Db not connected');
})

