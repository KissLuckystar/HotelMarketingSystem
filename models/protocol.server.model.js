/**
 * Created by smk on 2016/12/9.
 * 协议管理
 */
var mongoose=require('mongoose');

var ProtocolSchema=new mongoose.Schema({
    name:String,   //协议标题
    content:String,   //协议内容
    user_id:{   //创建人
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    create_time:{   //创建时间
        type:Date,
        default:Date.now
    },
    note:String   //备注
});

mongoose.model('Protocol',ProtocolSchema);
