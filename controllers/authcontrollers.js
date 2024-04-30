const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const generateTokenAndSetCookie = require("../utils/generateToken");
// import generateTokenAndSetCookie from "../utils/generateToken";
exports.signup = async (req, res) => {
  try {
    // data fetched
    const { fullname, username, password, confirmPassword, gender } = req.body;
    console.log(fullname);
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password didnt match",
      });
    }
    // check if user already exists or not
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    //-->user dont exist so create new entry

    // https://avatar.iran.liara.run/username?username=[firstname+lastname]
    // https://avatar.iran.liara.run/public/girl
    // https://avatar.iran.liara.run/public/boy?username=Scott

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // profilePic=`https://avatar.iran.liara.run/username?username=${fullname}`

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    if (newUser) {
      // not needed
      //  generateTokenAndSetCookie(newUser._id,res);
      await newUser.save();

      res.status(200).json({
        success: true,
        _id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        message: "Invalid Data",
      });
    }
  } catch (error) {
    console.log("Error in signup Controller");
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
exports.login = async (req, res) => {
  try {
    
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: true,
        message: "please fill all the details properly",
      });
    }

    let user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        const payload={
            id:user._id,
        }
        
        if (!user || !isPasswordCorrect) {
          return res.status(400).json({ error: "Invalid username or password" });
        }else{
          
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
          
          res.cookie("token",token,options,{
            maxAge:15*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            message:"user logged in successfully",
            
          });
        }
        
        res.status(200).json({
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          profilePic: user.profilePic,
        });
        

  } catch (error) {
    console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.logout = async (req, res) => {
    try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
