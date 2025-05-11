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
const userRouter = require('./routes/user')


app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);







    







ConnectDb().then(()=>{
    console.log('Db connected');
    app.listen(7777 ,()=>{
        console.log('server connected');
    })
}).catch((err) =>{
    console.error('Db not connected');
})

