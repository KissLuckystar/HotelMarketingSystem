/**
 * Created by smk on 2016/12/6.
 * 权限管理路由
 */
var express=require('express');
var router=express.Router();
var crypto=require('crypto');//用于加密
var async=require('async');
var mongoose=require('mongoose');
var Hotel=mongoose.model('Hotel');
var UserGroup=mongoose.model('UserGroup');
var User=mongoose.model('User');
var UserFunc=mongoose.model('UserFunc');
mongoose.Promise =global.Promise;//解决（mongoose's default promise library) is deprecated

var checkLogin=require('../middlewares/checkLogin').checkLogin;
var dbHelper = require('../middlewares/dbHelper');

/**
 * 用户组管理路由控制
 */
//用户组管理页面
router.get('/usergroup',checkLogin,function(req,res,next){
    res.render('authority/usergroup/index');
});
//查询用户组列表，条件查询
router.post('/usergroup/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_usergroup=req.fields.search_usergroup;
    var populate = "hotel_id";   //格式为字符串，用于populate查询
    if(search_usergroup){
        var usergroup_name=new RegExp(search_usergroup, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : usergroup_name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,UserGroup,populate,queryParams,{},function(error,$page){
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
        dbHelper.pageQuery(page,rows,UserGroup,populate,{},{},function(error,$page){
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
router.post('/usergroup/add',checkLogin,function(req,res,next){
    var name=req.fields.name;
    var hotel_id=req.fields.hotel_id;
    var authority=req.fields.authority;
    var note=req.fields.note;
    var data={
        state : 0,
    };
    var usergroup=new UserGroup({
        name:name,
        hotel_id:hotel_id,
        authority:authority,
        note:note
    });
    console.log('usergroup:',usergroup);
    usergroup.save(function(err){
        if(err){
            console.log('error','新增失败');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//获取要编辑的用户组信息
router.post('/usergroup/edit',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    //查询选择项的信息
    UserGroup.findOne({_id:id}).populate('hotel_id').exec(function(err,usergroup){
        if(err){
            console.log('find err');
            return;
        }
        if(!usergroup){
            console.log('error','该选择项不存在');
            return;
        }
        return res.json(usergroup);
    });
});
//编辑用户组信息
router.post('/usergroup/update',checkLogin,function(req,res,next){
    var id=req.fields.id;
    var name=req.fields.name;
    var hotel_id=req.fields.hotel_id;
    var authority=req.fields.authority;
    var note=req.fields.note;
    var data={
        state : 0,
    };
    var usergroup={
        name:name,
        hotel_id:hotel_id,
        authority:authority,
        note:note
    };
    //console.log('update usergroup:',usergroup);
    UserGroup.update({_id:id},{$set:usergroup},function(err){
        if(err){
            console.log('err');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//删除用户组信息
router.post('/usergroup/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        UserGroup.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});

/**
 * 用户管理路由控制
 */
//用户管理页面
router.get('/user',checkLogin,function(req,res,next){
    res.render('authority/user/index');
});
//查询用户组列表，条件查询
router.post('/user/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_user=req.fields.search_user;
    var populate = "hotel_id group_id usergroup_id";   //格式为字符串，用于populate查询
    if(search_user){
        var user_name=new RegExp(search_user, 'i');   //不区分大小写
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
//新增用户组信息
router.post('/user/add',checkLogin,function(req,res,next){
    var account=req.fields.account;
    var name=req.fields.name;
    var password=req.fields.password;
    var sex=req.fields.sex;
    var birth=req.fields.birth;
    var phone=req.fields.phone;
    var email=req.fields.email;
    var identity=req.fields.identity;
    var hotel_id=req.fields.hotel_id;
    var group_id=req.fields.group_id;
    var usergroup_id=req.fields.usergroup_id;
    var state=req.fields.state;
    var data={
        state : 0
    };
    var user=new User({
        account:account,
        name:name,
        password:password,
        sex:sex,
        birth:birth,
        phone:phone,
        email:email,
        identity:identity,
        hotel_id:hotel_id,
        group_id:group_id,
        usergroup_id:usergroup_id,
        state:state
    });
    //console.log('user:',user);
    user.save(function(err){
        if(err){
            console.log('error','新增失败');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//获取要编辑的用户组信息
router.post('/user/edit',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    //查询选择项的信息
    User.findOne({_id:id}).populate('hotel_id group_id usergroup_id').exec(function(err,user){
        if(err){
            console.log('find err');
            return;
        }
        if(!user){
            console.log('error','该选择项不存在');
            return;
        }
        return res.json(user);
    });
});
//编辑用户组信息
router.post('/user/update',checkLogin,function(req,res,next){
    var id=req.fields.id;
    var name=req.fields.name;
    var password=req.fields.password;
    var sex=req.fields.sex;
    var birth=req.fields.birth;
    var phone=req.fields.phone;
    var email=req.fields.email;
    var identity=req.fields.identity;
    var hotel_id=req.fields.hotel_id;
    var group_id=req.fields.group_id;
    var usergroup_id=req.fields.usergroup_id;
    var state=req.fields.state;
    var data={
        state : 0,
    };
    var user={
        name:name,
        password:password,
        sex:sex,
        birth:birth,
        phone:phone,
        email:email,
        identity:identity,
        hotel_id:hotel_id,
        group_id:group_id,
        usergroup_id:usergroup_id,
        state:state
    };
    console.log('update user:',user);
    User.update({_id:id},{$set:user},function(err){
        if(err){
            console.log('err');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//删除用户组信息
router.post('/user/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        User.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});

module.exports=router;