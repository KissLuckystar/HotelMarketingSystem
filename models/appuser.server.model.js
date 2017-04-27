/**
 * Created by smk on 2017/3/8.
 * 移动客户端APPUser info
 */
var mongoose=require('mongoose');

//定义后台管理员的Schema
var AppUserSchema=new mongoose.Schema({
    account:String,   //账号
    name:{            //姓名
        type:String,
        trim:true//去空格
    },
    password:String,   //密码
    phone:String,   //电话
    email:String,   //邮箱
    account_money: {   //账户
        type:Number,
        unique: true
    },
    account_tmoney:Number, //账户总资产
    account_lmoney:Number,   //账户余额
    integral:Number,
    pay_pass:String,   //支付密码
    photo:String,   //头像
    create_time:{    //注册时间
        type:Date,
        default:Date.now
    },
    state:String    //状态
});

mongoose.model('AppUser',AppUserSchema);