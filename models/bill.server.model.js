/**
 * Created by smk on 2017/4/27.
 * 账单
 */
var BillSchema=new mongoose.Schema({
    product_id:{            //产品编号，名称
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    appuser_id:{            //购买者
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AppUser'
    },
    buy_money:Number,   //购买金额
    user_id:{      //操作人
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    create_time:{    //购买时间
        type:Date,
        default:Date.now
    },
    device_id:{  //设备编号
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Device'
    },
    state:String    //购买状态
});

mongoose.model('Bill',BillSchema);