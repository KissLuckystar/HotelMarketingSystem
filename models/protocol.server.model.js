/**
 * Created by smk on 2016/12/9.
 * 协议信息表
 * 字段主要包括协议标题，协议内容，备注
 */
var mongoose=require('mongoose');

var ProtocolSchema=new mongoose.Schema({
    title:String,
    content:String,
    note:String
});

mongoose.model('Protocol',ProtocolSchema);
