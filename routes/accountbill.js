/**
 * Created by smk on 2017/3/8.
 * 账户账单路由类
 */
var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var crypto=require('crypto');//加密解密

var AppUser=mongoose.model('AppUser');
var Bill=mongoose.model('Bill');
mongoose.Promise=global.Promise;

var checkLogin=require('../middlewares/checkLogin').checkLogin;
var dbHelper = require('../middlewares/dbHelper');

/**
 * 用户管理路由控制
 */
//用户管理页面
router.get('/appuser',checkLogin,function(req,res,next){
    res.render('accountbill/account/index');
});
//查询用户组列表，条件查询
router.post('/appuser/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_appuser=req.fields.search_appuser;
    var populate = "";   //格式为字符串，用于populate查询
    if(search_appuser){
        var user_name=new RegExp(search_appuser, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : user_name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,AppUser,populate,queryParams,{},function(error,$page){
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
        dbHelper.pageQuery(page,rows,AppUser,populate,{},{},function(error,$page){
            if(error){
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
//新增用户组信息
router.post('/appuser/add',checkLogin,function(req,res,next){
    var account=req.fields.account;
    var name=req.fields.name;
    var password=req.fields.password;
    var phone=req.fields.phone;
    var email=req.fields.email;
    var state=req.fields.state;
    var data={
        state : 0
    };
    var appuser=new AppUser({
        account:account,
        name:name,
        password:password,
        phone:phone,
        email:email,
        account_money:phone,
        account_tmoney:0,
        account_lmoney:0,
        pay_pass:'000000',
        photo:'',
        state:state
    });
    //console.log('user:',user);
    appuser.save(function(err){
        if(err){
            console.log('error','新增失败');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//获取要编辑的用户组信息
router.post('/appuser/edit',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    //查询选择项的信息
    AppUser.findOne({_id:id}).populate('').exec(function(err,appuser){
        if(err){
            console.log('find err');
            return;
        }
        if(!appuser){
            console.log('error','该选择项不存在');
            return;
        }
        return res.json(appuser);
    });
});
//编辑用户组信息
router.post('/appuser/update',checkLogin,function(req,res,next){
    var id=req.fields.id;
    var name=req.fields.name;
    var password=req.fields.password;
    var phone=req.fields.phone;
    var email=req.fields.email;
    var state=req.fields.state;
    var data={
        state : 0,
    };
    var appuser={
        name:name,
        password:password,
        phone:phone,
        email:email,
        state:state
    };
    //console.log('update user:',user);
    AppUser.update({_id:id},{$set:appuser},function(err){
        if(err){
            console.log('err');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//删除用户组信息
router.post('/appuser/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        AppUser.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});
/**
 * 账单管理路由控制
 */
//用户管理页面
router.get('/bill',checkLogin,function(req,res,next){
    res.render('accountbill/bill/index');
});
//查询用户组列表，条件查询
router.post('/bill/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_bill=req.fields.search_bill;
    var populate = "hotel_id group_id usergroup_id";   //格式为字符串，用于populate查询
    if(search_bill){
        var user_name=new RegExp(search_bill, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : user_name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,User,populate,queryParams,{},function(error,$page){
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
        dbHelper.pageQuery(page,rows,User,populate,{},{},function(error,$page){
            if(error){
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







//app用户登录
router.post('/appuserlogin',function(req,res,next){
    var appUserAccount=req.fields.appUserAccount;
    var password=req.fields.password;

    AppUser.findOne({'appUserAccount':appUserAccount},function(err,user){
        if(err){
            res.send(JSON.stringify({'error':'服务器错误，请稍后再试'}));
        }
        if(!user){
            console.log('用户不存在');
            res.send(JSON.stringify({'error':'账户不存在，请注册'}));
        } else {
            //生成密码的md5值
            //var md5 = crypto.createHash('md5');
            //password = md5.update(password).digest('hex');
            //console.log(password);
            if (user.password == password) {
                res.send(JSON.stringify({'success':'正在登录'}));
            }else{
                res.send(JSON.stringify({'error':'密码错误，请核对后输入'}));
            }
        }


    });
});

module.exports=router;


