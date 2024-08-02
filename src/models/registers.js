const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const employeeRegister=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
})

employeeRegister.methods.generateTokens=async function(){
    try{
       const token= await jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
       this.tokens=this.tokens.concat({token:token})
       return token;
    }catch(e){
        console.log('the error part ',e);
        res.send('the error part ',e);
    }
}

employeeRegister.pre('save',async function(next){
    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10)

}
next();
}
)

const EmployeeRegister=new mongoose.model('EmployeeRegister', employeeRegister)

module.exports=EmployeeRegister;