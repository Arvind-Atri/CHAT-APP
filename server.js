const express = require("express");
require("dotenv").config();

const cors=require("cors");  ////////ttttttttesstttt
const cookieParser=require("cookie-parser")
const authroutes = require("./routes/authroutes");
const messageroutes = require("./routes/messageroutes");
const userRoutes = require("./routes/userroutes");
const dbConnect = require("./config/database");
const { app, server } = require("./socket/socket");
const path=require("path")
// const app = express();

//
app.use(cors())

//

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
// const __dirname=path.resolve();
app.get("/", (req, res) => {
  res.send("Hello fbmbb");
});

app.use("/api/auth", authroutes);
app.use("/api/messages", messageroutes);
app.use("/api/users",userRoutes);


app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

server.listen(PORT, () => {
  dbConnect();
  console.log("server is active");
});
