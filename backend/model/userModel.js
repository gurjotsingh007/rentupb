const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please Enter Your Name'],
    },
    email:{
        type:String,
        required:[true, 'Please Enter Your Email'],
        unique:true,
        validate:[validator.isEmail, 'Please Enter a Valid Email']
    },
    password:{
        type:String,
        required:[true, 'Please Enter Your Password'],
        minLength:[8, 'Password should have atleast 8 characters'],
        // select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    loginAttempts: {
    type: Number,
    default: 0,
    },
    lockUntil: {
    type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, 'ASDFGHJKLELLEASDFGHJKL', {
        expiresIn: '2519d',
    });
};

//Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);