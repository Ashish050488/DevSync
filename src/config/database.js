const mongoose =  require('mongoose')
const dotenv= require('dotenv');
dotenv.config();
const ConnectDb = async ()=>{
    await mongoose.connect(process.env.Db, {autoIndex: true})
}

module.exports  = ConnectDb;

