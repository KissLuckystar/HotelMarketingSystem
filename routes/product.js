/**
 * Created by smk on 2017/3/8.
 * 产品路由
 */
var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');

var Product=mongoose.model('Product');
mongoose.Promise=global.Promise;

/** APP路由 start **/
//APP用户管理页面
router.get('/app_product',function(req,res,next){
    var classify=req.query.q;
    if(classify=='recommend'){
        Product.find({'classify':classify},function(err,products){
            if(err){
                console.log('find device err',err);
            }
            if(!products){
                //throw new Error('列表为空');
                console.log('列表为空');
            }
            res.send({
                'total_count':products.length,
                'items':products
            });
        })
    }else{
        Product.find({},function(err,products){
            if(err){
                console.log('find device err',err);
            }
            if(!products){
                //throw new Error('列表为空');
                console.log('列表为空');
            }
            res.send({
                'total_count':products.length,
                'items':products
            });
        })
    }

});



/** APP路由 end **/


module.exports=router;