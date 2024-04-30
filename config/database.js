const mongoose=require("mongoose");

require("dotenv").config();

const dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("db connected successfully"))
    .catch((err)=>console.log("error occured in db connection"));
}

module.exports=dbConnect;