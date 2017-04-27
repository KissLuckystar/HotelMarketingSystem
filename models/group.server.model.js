/**
 * Created by smk on 2016/12/10.
 * 班组
 */
var mongoose=require('mongoose');

var GroupSchema=new mongoose.Schema({
    name:String,     //班组名称
    hotel_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Hotel'
    },   //所属酒店
    begin_time:String,   //开始时间
    end_time:String,   //结束时间
    note:String
});

mongoose.model('Group',GroupSchema);