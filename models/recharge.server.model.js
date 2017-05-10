/**
 * Created by smk on 2017/4/27.
 * 充值
 */
var mongoose=require('mongoose');

var RechargeSchema=new mongoose.Schema({
    appuser_id:{            //充值账户 姓名
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AppUser'
    },
    product_id:{            //产品编号，名称
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    recharge:Number,   //充值金额
    back:Number,   //赠送金额
    way:String,   //充值方式
    user_id:{      //操作人
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    create_time:{    //充值时间
        type:Date,
        default:Date.now
    },
    state:String    //充值状态
});

mongoose.model('Recharge',RechargeSchema);