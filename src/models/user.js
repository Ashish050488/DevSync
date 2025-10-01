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
        default:'https://imgs.search.brave.com/zXViuUpCT1g5k-aOXp12gFfJdBh9uWwpLeP_5YN9W5Y/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2FiLzhk/L2RmL2FiOGRkZjQ5/ZGE0NmVkMTYyNjZj/NDE2NWMzNTIxMGRl/LmpwZw'
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