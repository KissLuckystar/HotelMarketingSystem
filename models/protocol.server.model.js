/**
 * Created by smk on 2016/12/9.
 * Э����Ϣ��
 * �ֶ���Ҫ����Э����⣬Э�����ݣ���ע
 */
var mongoose=require('mongoose');

var ProtocolSchema=new mongoose.Schema({
    title:String,
    content:String,
    note:String
});

mongoose.model('Protocol',ProtocolSchema);
