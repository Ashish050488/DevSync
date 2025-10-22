const jwt = require('jsonwebtoken');
const  bcrypt  = require('bcrypt') 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,    
        maxLength:50,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique: true
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18
    },
    gender: {
        type: String,
        enum: {
          values: ['male', 'female', 'others'],
          message: '{VALUE} is not a valid gender'
        }
      },
      
    photoUrl:{
        type:String,
        default:'https://tse1.mm.bing.net/th/id/OIP.jS5TpucdX1Y0lo3Nw6lf7wHaHV?cb=12ucfimg=1&w=505&h=500&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    about:{
        type:String,
        default:'this is your default profile',
        maxLength:[400, 'About section cannot exceed 300 character']
    },
    skills:{
        type:[String],
        default:['JavaScript','NodeJs']
    }
},{timestamps:true})


userSchema.methods.getJwt =async  function () {
    const user = this
      const token = await jwt.sign({_id:user.id},'Dev@sync01',{
        expiresIn:"7d"
      });
    return token
}

userSchema.pre('save',async function(next) {
    const user = this;
   try {
    if(user.isModified('password')){
        user.password = await bcrypt .hash(user.password,10)
    }
    next()
   } catch (error) {
    next(error)
   }
})


userSchema.methods.validatePassword = async  function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password
    const isPasswordValid = await bcrypt .compare(passwordInputByUser,passwordHash)
    return isPasswordValid 
}


module.exports = mongoose.model('User',userSchema)