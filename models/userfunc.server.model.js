/**
 * Created by smk on 2017/4/17.
 * 用户功能
 */
var mongoose=require('mongoose');

var UserFuncSchema=new mongoose.Schema({
    id:Number,  //节点编号
    name:String,
    text:String,
    state:String,
    iconCls:String,
    url:String,
    nid:Number,  //父节点编号
});

mongoose.model('UserFunc',UserFuncSchema);