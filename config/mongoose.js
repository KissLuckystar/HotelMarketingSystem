/**
 * Created by smk on 2016/11/4.
 * 2.配置mongoose的配置文件
 */
var mongoose=require('mongoose');
var config=require('config-lite');

module.exports=function(){
    var db=mongoose.connect(config.mongodb);//数据库连接
    //引入User model
    require('../models/user.server.model.js');//引用相关的model
    //引入酒店信息model
    require('../models/hotel.server.model.js');
    //引入设备信息model
    require('../models/device.server.model.js');
    //引入协议信息model
    require('../models/protocol.server.model.js');
    return db;//返回数据库实例
};