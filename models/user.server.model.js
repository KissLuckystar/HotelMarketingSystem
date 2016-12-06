/**
 * Created by smk on 2016/11/4.
 * 3.创建相关的model
 */

var mongoose=require('mongoose');

//定义后台管理员的Schema
var UserSchema=new mongoose.Schema({
    userId:Number,
    userName:{
        type:String,
        trim:true//去空格
    },
    userPassword:String,
    userSex:String,
    userPhone:String,
    userEmail:String,
    userIdentity:String,//用户身份，主要包括管理员，收银员
    userHotelCode:String,
    userClassCode:String,
    userStatus:String,
    userAuthority:String,
    createTime:Date,
    lastLogin:Date
});

mongoose.model('User',UserSchema);