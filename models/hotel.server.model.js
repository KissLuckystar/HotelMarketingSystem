/**
 * Created by smk on 2016/12/7.
 * 酒店信息表
 */
var mongoose=require('mongoose');

var HotelSchema=new mongoose.Schema({
    hotel_name:String,
    hotel_address:String,
    phone:String,
    note:String
});

mongoose.model('Hotel',HotelSchema);