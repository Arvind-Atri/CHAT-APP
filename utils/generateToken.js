const jwt=require("jsonwebtoken");
require("dotenv").config();

const generateTokenAndSetCookie=(userId,res)=>{
    // console.log('kkkkllll')
    // const token=jwt.sign({userId},process.env.JWT_SECRET,{
    //     expiresIn:'15d'
    // })
    // res.cookie("token",token,{
    //     maxAge:15*24*60*60*1000,
    //     httpOnly:true,
    //     sameSite:"strict"
    // })
    let token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        })
        // user=user.toObject();
        // user.token=token;
        // user.password=undefined;
        const options={
            expiresIn:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            maxAge:15*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            message:"user logged in successfully",
            
        });
}
// export default generateTokenAndSetCookie;
module.exports=generateTokenAndSetCookie;