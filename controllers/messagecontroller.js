const Conversation=require("../models/conversationModel")
const Message=require("../models/messageModel");
const { getReceiverSocketId } = require("../socket/socket");

exports.sendMessage=async(req,res)=>{
    try {
        const{message}=req.body;
        const recieverId=req.params.id;
        const senderId=req.user._id;
        console.log("msg:",message);
        console.log("sender:",senderId,"reciever:",recieverId)
        console.log("sender",senderId);
        let conversation=await Conversation.findOne({
            participants:{
                $all:[senderId,recieverId]
            },
        })

        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,recieverId],
            })
        }

        const newMessage=new Message({
            senderId,
            recieverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        
        // await conversation.save();
        // await newMessage.save();
        //the above two lines can be replaced by
        await Promise.all([conversation.save(),newMessage.save()]);
        // socket io implementation

        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sending message",error.message)
        res.status(500).json({
            error:"Internal server Error"
        })
    }
}


exports.getMessages=async(req,res)=>{
    try {
        const userToChatId =req.params.id;

        const senderId=req.user._id;
        const conversation=await Conversation.findOne({
            participants:{
                $all:[senderId,userToChatId]
            }
        }).populate("messages");
        if(!conversation){
            return res.status(200).json([]);
        }
         
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log("Error in get Message controller:",error.message);
        res.status(500).json({
            error:"Internal server Error"
        })
    }
}