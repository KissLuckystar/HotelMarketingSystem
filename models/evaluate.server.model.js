/**
 * Created by smk on 2017/4/27.
 * 评价
 */
var mongoose=require('mongoose');

var EvaluateSchema=new mongoose.Schema({
    product_id:{            //产品名称
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    appuser_id:{            //用户姓名
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AppUser'
    },
    content:String,   //评论内容
    score:Number,   //评论分数
    create_time:{    //评论时间
        type:Date,
        default:Date.now
    },
    state:String    //评论状态
});

mongoose.model('Evaluate',EvaluateSchema);
