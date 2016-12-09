/**
 * Created by smk on 2016/12/9.
 * 活动表
 */
var mongoose=require('mongoose');

var ActivitySchema=new mongoose.Schema({
    publisher:mongoose.Schema.Types.ObjectId,
    title:String,
    content:String,
    file:String,
    status:String,
    create_time:{}
});

mongoose.model('Activity',ActivitySchema);