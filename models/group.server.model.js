/**
 * Created by smk on 2016/12/10.
 */
var mongoose=require('mongoose');

var GroupSchema=new mongoose.Schema({
    name:String,
    hotel:String,
    group_code:String,
    begin_time:String,
    end_time:String,
    note:String
});

mongoose.model('Group',GroupSchema);