/**
 * Created by smk on 2016/12/9.
 * 活动表
 */
var mongoose=require('mongoose');

var ActivitySchema=new mongoose.Schema({
    publisher:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    title:String,
    content:String,
    file:String,
    state:String,
    begin_time:Date,
    end_time:Date,
    create_time:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('Activity',ActivitySchema);