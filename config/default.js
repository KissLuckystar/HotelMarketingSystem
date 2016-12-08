/**
 * Created by smk on 2016/11/4.
 * 1.存储相关配置文件
 */
module.exports={
    port:3000,
    session:{
        secret:'HotelMarketingSystem',
        key:'HotelMarketingSystem',
        maxAge:1000*60*60  //设置一小时过期
    },
    mongodb:'mongodb://10.141.93.82:27017/hotelMarketing'
};