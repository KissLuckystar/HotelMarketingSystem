/**
 * Created by smk on 2017/5/9.
 */


var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');

var Product=mongoose.model('Product');
mongoose.Promise=global.Promise;

var checkLogin=require('../middlewares/checkLogin').checkLogin;
var dbHelper = require('../middlewares/dbHelper');




router.get('/productsale',checkLogin,function(req,res,next){
    res.render('salesstatistics/productsale/index');
});
router.get('/productstock',checkLogin,function(req,res,next){
    res.render('salesstatistics/productstock/index');
});

//获取要编辑的电子预售券信息
router.post('/productstock/data',checkLogin,function(req,res,next){
    var name=req.fields.search_stock;

    Product.findOne({name:name}).populate('user_id protocol_id').exec(function(err,product){
        if(err){
            console.log('find err');
            return;
        }
        if(!product){
            console.log('error','该选择项不存在');
            return res.json({
                state:0
            });
        }
        return res.json({
            product:product,
            state:1
        });
    });
});


module.exports=router;