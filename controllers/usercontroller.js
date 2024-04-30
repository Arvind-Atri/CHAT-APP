const User=require("../models/usermodel")


exports.getUserForSidebar=async(req,res)=>{
    try {
       const loggedInUserId=req.user._id;
        // console.log(loggedInUserId);
       const allUsers=await User.find({
        _id:{$ne:loggedInUserId}
       })
       res.status(200).json(allUsers);
    } catch (error) {
        console.log("Error in get user for sidebar controller",error.message)
        res.status(500).json({
            error:"Internal Server Error",
        })
    }
}