/**
 * Created by smk on 2016/12/8.
 * 权限表
 * 主要包括权限名称和权限备注两个字段
 */
var mongoose=require('mongoose');

var UserGroupSchema=new mongoose.Schema({
    name:String,
    hotel:String,
    authority:String,
    note:String
});

mongoose.model('UserGroup',UserGroupSchema);