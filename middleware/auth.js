const jwt=require('jsonwebtoken')
const Register=require('../src/models/registers')

const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt1;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyUser);

        const user=await Register.findOne({_id:verifyUser._id})
        // console.log(user)
        req.user=user;
        // req.token=token
        next();
    }
    catch(e){
        res.status(401).send(e)
    }
}

module.exports=auth;