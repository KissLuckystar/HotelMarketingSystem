/**
 * Created by smk on 2016/11/4.
 * 3.创建相关的model
 * 酒店用户
 */

var mongoose=require('mongoose');

//定义后台管理员的Schema
var UserSchema=new mongoose.Schema({
    account:Number,    //账号
    name:String,   //姓名
    password:String,  //密码
    sex:String,  //性别
    birth:Date,   //出生日期
    phone:String,   //电话号码
    email:String,   //邮箱
    identity:String,//用户身份，主要包括管理员，收银员
    hotel_id:{   //酒店编号
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Hotel'
    },
    group_id:{   //班组编号
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Group'
    },
    usergroup_id:{   //用户组编号
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserGroup'
    },
    state:String,   //状态
    create_time:{   //创建时间
        type:Date,
        default:Date.now
    },
});

mongoose.model('User',UserSchema);