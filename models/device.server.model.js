/**
 * Created by smk on 2016/12/8.
 * 设备信息表
 * 主要字段包括所属酒店，设备编号，MAC地址，设备状态，备注
 */
var mongoose=require('mongoose');

var DeviceSchema=new mongoose.Schema({
    device_hotel:String,
    device_num:String,
    device_mac:String,
    device_status:Number,
    note:String
});

mongoose.model('Device',DeviceSchema);