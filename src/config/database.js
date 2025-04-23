const mongoose =  require('mongoose')

const ConnectDb = async ()=>{
    await mongoose.connect("mongodb://localhost:27017/DevSync", {autoIndex: true})
}

module.exports  = ConnectDb;

