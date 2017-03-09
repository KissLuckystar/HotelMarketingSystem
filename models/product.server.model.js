/**
 * Created by smk on 2017/3/8.
 */
var mongoose=require('mongoose');

//定义后台管理员的Schema
var ProductSchema=new mongoose.Schema({
    name:String,
    issuer:{
        type:String,
        trim:true//去空格
    },
    startInterest:Date,
    endInterest:Date,
    annualRate:String,
    totalAmount:Number,
    minAmount:Number, //账户总资产
    maxAmount:Number,   //账户余额
    startSell:Date,   //支付密码
    endSell:Date,
    leftAmount:Number,
    auditStatus:String,
    maintainStatus:String,
    note:String
});

mongoose.model('Product',ProductSchema);