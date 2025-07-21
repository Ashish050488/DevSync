const express = require('express');
const mongoose = require('mongoose');
const ConnectDb = require('./src/config/database');
const User = require('./src/models/user');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Add CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());





const authRouter = require('./src/routes/auth')
const profileRouter = require('./src/routes/profile')
const requestRouter = require('./src/routes/request')
const userRouter = require('./src/routes/user')


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

