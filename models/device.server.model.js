/**
 * Created by smk on 2016/12/8.
 * 设备信息表
 * 主要字段包括所属酒店，设备编号，MAC地址，设备状态，备注
 */
var mongoose=require('mongoose');

var DeviceSchema=new mongoose.Schema({
    name:String,   //设备编号
    mac:String,   //MAC地址
    hotel_account:String,   //银行账户
    hotel_id:{   //所属酒店
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Hotel'
    },
    state:String,  //设备状态
    note:String   //备注
});

mongoose.model('Device',DeviceSchema);