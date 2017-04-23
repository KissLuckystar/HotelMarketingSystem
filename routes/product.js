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
    }else if(classify=='all'){
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
    }else{
        classify=new RegExp(classify,'i');//不区分大小写
        Product.find({                       //多条件模糊查询
            $or:[
                {name:{$regex:classify}},
                {note:{$regex:classify}}
            ]
        },null,{
            sort:{_id:-1},
            limit:100
        },function(err,products){
            if(err){
                console.log('find device err',err);
            }
            if(!products){
                console.log('列表为空');
                res.send({
                    'total_count':0
                });
            }
            res.send({
                'total_count':products.length,
                'items':products
            });
        })
    }

});



/** APP路由 end **/

router.get('/customization',function(req,res,next){
    res.render('product/customization/index');
});



module.exports=router;