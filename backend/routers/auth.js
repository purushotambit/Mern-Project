const express =require('express');
const router = express.Router();
const User=require('../models/User');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchuser = require('../middilwere/fetchuser');
const JWT_SECRET="PURUSOTAM";
router.post('/register', async(req,res)=>{
    console.log(req.body);
    const {name,email,password,cpassword}=req.body;
    if(!name||!email||!password||!cpassword){
       return res.status(401).json({message:" Please fill correct credeintial:"})
    }
    try{
        const isPresent=await User.findOne({email:email});
        if(isPresent){
            return   res.status(400).json({message:"User is already exists :"});
        }
        if(password!==cpassword){
            return res.status(402).json({message:"Password and confern password is not matching :"});
        }
        const salt =  bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(password, salt);
        const user=await User({name:name,email:email,password:secPass,cpassword:secPass});
        user.save();
    const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      user.tokens=user.tokens.concat({token:authtoken});
      res.cookie("jwtoken",authtoken,{
        expires:new Date(Date.now()+30000),
        httpOnly:true,
        secure:true
      })
      // res.json({ authtoken })
      res.status(200).json({message:"Registation is Successfull :"});
    }catch(err){
        console.error(err.message);
        return res.status(500).json({message:"Internal Server error"})
    }  
})
router.post('/login',async (req,res)=>{

    const {email,password}=req.body;
    if(!email||!password){
        return res.status(401).json({message:" Please fill correct credeintial:"})
    }
    try {
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(402).json({message:"User is not exists using this email id :"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(403).json({message:"Enter correct Password :"});
        }
        const data = {
            user: {
              id: user.id
            }
          }
          const authtoken = jwt.sign(data, JWT_SECRET);
          // res.json(user)
          user.tokens=user.tokens.concat({token:authtoken});
          res.cookie("jwtoken",authtoken,{
            expires:new Date(Date.now()+30000),
            httpOnly:true
          })
          res.status(200).json({message:"Login is Successfull: "});
          // res.json({authtoken})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message:"Internal Server error"})
    }
})
router.get('/about', fetchuser,  async (req, res) => {
    try {
    const  userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
  router.post('/contact', fetchuser,async (req, res) => {
    try {
     const {name,email,subject,message}=req.body;
     const userId = req.user.id;
     const user = await User.findById(userId).select("-password")
     if(user){
      const userMessage= await user.addMessage(name,email,subject,message);
      await user.save();
      res.status(201).json({message:"User message is successfully uploaded"});
     }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
  router.get('/logout',(req,res)=>{
    console.log('Hello my Logout Page');
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('User logout');
  })
module.exports=router;