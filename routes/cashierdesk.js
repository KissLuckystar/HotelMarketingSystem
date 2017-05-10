/**
 * Created by smk on 2017/5/8.
 */


var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');

var Recharge=mongoose.model('Recharge');
var Product=mongoose.model('Product');
mongoose.Promise=global.Promise;

var checkLogin=require('../middlewares/checkLogin').checkLogin;
var dbHelper = require('../middlewares/dbHelper');


router.get('/recharge',checkLogin,function(req,res,next){
    res.render('cashierdesk/recharge/index');
});
router.get('/recharge/record',checkLogin,function(req,res,next){
    res.render('cashierdesk/record/index');
});
router.get('/return',checkLogin,function(req,res,next){
    res.render('cashierdesk/return/index');
});

//查询电子预售券列表，条件查询
router.post('/recharge/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_product=req.fields.search_producti;

    var populate = "user_id protocol_id";   //格式为字符串，用于populate查询

    if(search_product){
        var name=new RegExp(search_product, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : name},
            audit_state: '通过',
            maintain_state:'销售中'
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,Product,populate,queryParams,{},function(error,$page){
            if(error){
                next(error);
            }else{
                res.json({
                    rows : $page.results,
                    total : $page.length,
                })
            }
        });
    }else{
        var queryParams={
            audit_state: '通过',
            maintain_state:'销售中'
        };
        dbHelper.pageQuery(page,rows,Product,populate,queryParams,{},function(error,$page){
            if(error){
                console.log(error);
                next(error);
            }else{
                res.json({
                    rows : $page.results,
                    total : $page.length,
                })
            }
        });
    }
});

//获取要购买的电子预售券信息
router.post('/recharge/info',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    //查询选择项的信息
    Product.findOne({_id:id}).populate('user_id protocol_id').exec(function(err,product){
        if(err){
            console.log('find err');
            return;
        }
        if(!product){
            console.log('error','该选择项不存在');
            return;
        }
        return res.json(product);
    });
});

//购买电子预售券
router.post('/recharge/buy',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var appuser_id =req.fields.appuser_id;
    var rechargeMoney =req.fields.recharge;
    var backMoney = req.fields.back;
    var way = req.fields.way;
    var user_id = req.session.user._id;


    var left_amount = req.fields.left_amount;   //总金额

    var recharge=new Recharge({
        appuser_id:appuser_id,
        product_id:id,
        recharge:rechargeMoney,
        back:backMoney,
        way:way,
        user_id:user_id,
        state:'充值成功'
    });
    //console.log('recharge:',recharge);
    left_amount=left_amount-rechargeMoney;   //剩余金额
    console.log('left_amount:',left_amount)
    //更新电子预售券剩余量信息
    var product={
        left_amount:left_amount,
    };

    Product.update({_id:id},{$set:product},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        recharge.save(function(err){
            if(err){
                console.log('error','新增失败');
                return res.json({
                    state:0
                });
            }
            return res.json({ state:1 });
        });
    });
});

//查询充值列表，条件查询
router.post('/recharge/record/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_recharge=req.fields.search_recharge;

    var populate = "appuser_id user_id product_id";   //格式为字符串，用于populate查询

    if(search_recharge){
        var name=new RegExp(search_recharge, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,Recharge,populate,queryParams,{},function(error,$page){
            if(error){
                next(error);
            }else{
                res.json({
                    rows : $page.results,
                    total : $page.length,
                })
            }
        });
    }else{
        dbHelper.pageQuery(page,rows,Recharge,populate,{},{},function(error,$page){
            if(error){
                console.log(error);
                next(error);
            }else{
                res.json({
                    rows : $page.results,
                    total : $page.length,
                })
            }
        });
    }
});

//查询充值列表，条件查询
router.post('/recharge/return/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_return=req.fields.search_return;

    var populate = "appuser_id user_id product_id";   //格式为字符串，用于populate查询

    if(search_return){
        var name=new RegExp(search_return, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,Recharge,populate,queryParams,{},function(error,$page){
            if(error){
                next(error);
            }else{
                res.json({
                    rows : $page.results,
                    total : $page.length,
                })
            }
        });
    }else{
        dbHelper.pageQuery(page,rows,Recharge,populate,{},{},function(error,$page){
            if(error){
                console.log(error);
                next(error);
            }else{
                res.json({
                    rows : $page.results,
                    total : $page.length,
                })
            }
        });
    }
});

module.exports=router;