/**
 * Created by smk on 2017/4/27.
 * 积分
 */
var mongoose=require('mongoose');

var IntegralSchema=new mongoose.Schema({
    appuser_id:{            //领取账户 姓名
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AppUser'
    },
    type:String,   //积分类型
    number:Number,   //积分数量
    begin_time:Date,   //开始时间
    end_time:Date,   //结束时间
    create_time:{    //创建时间
        type:Date,
        default:Date.now
    },
    note:String,   //说明
    state:String    //状态
});

mongoose.model('Integral',IntegralSchema);
