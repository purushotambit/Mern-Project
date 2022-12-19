const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema=new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    },
    message:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            subject:{
                type:String,
                required:true
            },
            message:{
                type:String,
                required:true
            }
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});
UserSchema.methods.addMessage=async function(name,email,subject,message){
    try{
        this.message=this.message.concat({name,email,subject,message});
        await this.save();
        return this.message;
    }catch (error){
        console.log(error);
    }
}
const User=mongoose.model('USER',UserSchema);
module.exports=User;