/**
 * Created by smk on 2017/3/8.
 * 移动客户端APPUser info
 */
var mongoose=require('mongoose');

//定义后台管理员的Schema
var AppUserSchema=new mongoose.Schema({
    appUserAccount:String,
    appUserName:{
        type:String,
        trim:true//去空格
    },
    password:String,
    phone:String,
    email:String,
    accountId:Number,
    accountTMoney:Number, //账户总资产
    accountLMoney:Number,   //账户余额
    payPassword:String,   //支付密码
    photo:String,
    createTime:Date,
    status:String
});

mongoose.model('AppUser',AppUserSchema);