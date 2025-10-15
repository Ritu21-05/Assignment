const jwt=require("jsonwebtoken");
const User=require("../models/User");

module.exports=async(req,res,next)=>{
    try{
       const authHeader=req.headers['authorization'];
       if(!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json("No token, authorization denied ");
       const token=authHeader.split(" ")[1];
       if(!token ) return res.status(401).json("Denied Access");
       const decode=jwt.verify(token,process.env.JWT_SECRET);
       const user=await User.findById(decode.user.id).select("-password");
       if(!user) return res.status(401).json("User not Found");
        req.user=user;
        next();
       

    }catch(err){
        console.log(err);
        if(err.name==="JsonWebTokenError")
            return res.status(401).json("token not valid");
        return res.status(500).json("Server error");
    }
};