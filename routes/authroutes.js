const { login, signup, logout} =require("../controllers/authcontrollers.js")


const express=require("express");
const router=express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);


module.exports= router;