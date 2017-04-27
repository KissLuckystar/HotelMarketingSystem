/**
 * Created by smk on 2016/12/8.
 * 权限表
 * 主要包括权限名称和权限备注两个字段
 */
var mongoose=require('mongoose');

var UserGroupSchema=new mongoose.Schema({
    name:String,  //用户组名称
    hotel_id:{   //所属酒店编号
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Hotel'
    },
    authority:String,   //用户组权限
    create_time:{   //创建时间
        type:Date,
        default:Date.now
    },
    note:String   //备注
});

mongoose.model('UserGroup',UserGroupSchema);