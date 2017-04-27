/**
 * Created by smk on 2017/3/8.
 * 产品路由
 */
var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');

var Product=mongoose.model('Product');
mongoose.Promise=global.Promise;

var checkLogin=require('../middlewares/checkLogin').checkLogin;
var dbHelper = require('../middlewares/dbHelper');

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


/** 后台管理路由 start **/

router.get('/customization',checkLogin,function(req,res,next){
    res.render('product/customization/index');
});
router.get('/verify',checkLogin,function(req,res,next){
    res.render('product/verify/index');
});
router.get('/maintain',checkLogin,function(req,res,next){
    res.render('product/maintain/index');
});

//查询电子预售券列表，条件查询
router.post('/customization/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_product=req.fields.search_productf;   //记录数

    var populate = "user_id protocol_id";   //格式为字符串，用于populate查询

    if(search_product){
        var name=new RegExp(search_product, 'i');   //不区分大小写
        var queryParams={
            $or : [
                {
                    name:{$regex : name},
                    audit_state: '未提交'
                },
                {
                    name:{$regex : name},
                    audit_state: '未通过'
                }
            ]
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
            $or : [
                {
                    audit_state: '未提交'
                },
                {
                    audit_state: '未通过'
                }
            ]
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
//新增电子预售券信息
router.post('/customization/add',function(req,res,next){
    var name =req.fields.name;
    var user_id = req.session.user._id;
    var annual_rate =req.fields.annual_rate;
    var total_amount = req.fields.total_amount;
    var min_amount = req.fields.min_amount;
    var max_amount = req.fields.max_amount;
    var start_sell = new Date(req.fields.start_sell);
    var end_sell = new Date(req.fields.end_sell);
    var start_interest = new Date(req.fields.start_interest);
    var end_interest = new Date(req.fields.end_interest);
    var left_amount = req.fields.total_amount;   //默认等于总金额
    var audit_state = req.fields.audit_state;
    var maintain_state = '';                     //默认为空，审核通过后开始赋值
    var protocol_id = req.fields.protocol_id;
    var note = req.fields.note;

    var data={
        state : 0,
    };
    //创建
    var product=new Product({
        name:name,
        user_id:user_id,
        annual_rate:annual_rate,
        total_amount:total_amount,
        min_amount:min_amount,
        max_amount:max_amount,
        start_sell:start_sell,
        end_sell:end_sell,
        start_interest:start_interest,
        end_interest:end_interest,
        left_amount:left_amount,
        audit_state:audit_state,
        maintain_state:maintain_state,
        protocol_id:protocol_id,
        note:note
    });
    //console.log(activity);
    product.save(function(err){
        if(err){
            console.log('error','新增失败');
            return res.json(data);
        }
        data.state=1;
        return res.json({
            state:1
        });
    });
});
//获取要编辑的电子预售券信息
router.post('/customization/edit',checkLogin,function(req,res,next){
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
//编辑电子预售券信息
router.post('/customization/update',checkLogin,function(req,res,next){
    var id = req.fields.id;

    var name =req.fields.name;
    var annual_rate =req.fields.annual_rate;
    var total_amount = req.fields.total_amount;
    var min_amount = req.fields.min_amount;
    var max_amount = req.fields.max_amount;
    var start_sell = new Date(req.fields.start_sell);
    var end_sell = new Date(req.fields.end_sell);
    var start_interest = new Date(req.fields.start_interest);
    var end_interest = new Date(req.fields.end_interest);
    var audit_state = req.fields.audit_state;
    var protocol_id = req.fields.protocol_id;
    var note = req.fields.note;

    var product={
        name:name,
        annual_rate:annual_rate,
        total_amount:total_amount,
        min_amount:min_amount,
        max_amount:max_amount,
        start_sell:start_sell,
        end_sell:end_sell,
        start_interest:start_interest,
        end_interest:end_interest,
        audit_state:audit_state,
        protocol_id:protocol_id,
        note:note
    };

    Product.update({_id:id},{$set:product},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});
//删除电子预售券信息
router.post('/customization/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        Product.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});
//修改电子预售券状态，提交审核
router.post('/customization/verify',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var product={
        audit_state:'审核中'
    };
    Product.update({_id:id},{$set:product},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});


//查询电子预售券列表，条件查询
router.post('/verify/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_product=req.fields.search_products;   //记录数

    var populate = "user_id protocol_id";   //格式为字符串，用于populate查询

    if(search_product){
        var name=new RegExp(search_product, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : name},
            audit_state: '审核中'
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
            audit_state: '审核中'
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
//修改电子预售券状态，审核通过
router.post('/verify/pass',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var product={
        audit_state:'通过',
        maintain_state:'待售'
    };
    Product.update({_id:id},{$set:product},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});
//修改电子预售券状态，审核未通过
router.post('/verify/notpass',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var product={
        audit_state:'未通过'
    };
    Product.update({_id:id},{$set:product},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});


//查询电子预售券列表，条件查询
router.post('/maintain/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_product=req.fields.search_productt;   //记录数

    var populate = "user_id protocol_id";   //格式为字符串，用于populate查询

    if(search_product){
        var name=new RegExp(search_product, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : name},
            audit_state: '通过'
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
            audit_state: '通过'
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
//修改电子预售券状态，待售
router.post('/maintain/pause',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var product={
        maintain_state:'待售'
    };
    Product.update({_id:id},{$set:product},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});
//修改电子预售券状态，开启销售
router.post('/maintain/unlock',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var product={
        maintain_state:'销售中'
    };
    Product.update({_id:id},{$set:product},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});
//修改电子预售券状态，下架
router.post('/maintain/stop',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var product={
        maintain_state:'已下架'
    };
    Product.update({_id:id},{$set:product},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});

/** 后台管理路由 end **/

module.exports=router;