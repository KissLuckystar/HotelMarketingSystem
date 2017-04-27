/**
 * Created by smk on 2017/4/27.
 * 电子预售券收益
 */
var mongoose=require('mongoose');

var EvaluateSchema=new mongoose.Schema({
    bill_id:{            //客户账单
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Bill'
    },
    total_money:Number,   //总金额
    use_money:Number,   //可用金额
    reward_money:Number,   //收益金额
    state:String    //状态
});

mongoose.model('Evaluate',EvaluateSchema);