/**
 * Created by smk on 2017/4/27.
 * 误收退还
 */
var mongoose=require('mongoose');

var ReturnSchema=new mongoose.Schema({
    trade_id:{            //交易单号
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Trade'
    },
    return:Number,   //退还金额
    user_id:{      //操作人
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    create_time:{    //退还时间
        type:Date,
        default:Date.now
    },
    state:String    //退还状态
});

mongoose.model('Return',ReturnSchema);