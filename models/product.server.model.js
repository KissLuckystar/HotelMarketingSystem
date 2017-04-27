/**
 * Created by smk on 2017/3/8.
 */
var mongoose=require('mongoose');

var ProductSchema=new mongoose.Schema({
    name:String,   //产品名称
    user_id:{      //发行人
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    annual_rate:Number,    //年化奖励率
    total_amount:Number,   //发行总额
    min_amount:Number, //起购金额
    max_amount:Number,   //限购金额
    start_sell:Date,   //发售日
    end_sell:Date,     //停售日
    start_interest:Date,   //起息日
    end_interest:Date,     //止息日
    left_amount:Number,   //剩余金额
    audit_state:String,   //审计状态   : 未提交，审核中，通过，未通过
    maintain_state:String,   //维护状态   ：待售，销售中，售罄，已下架
    protocol_id:{   //服务协议
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Protocol'
    },
    create_time:{   //创建时间
        type:Date,
        default:Date.now
    },
    note:String   //备注
});

mongoose.model('Product',ProductSchema);