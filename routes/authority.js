/**
 * Created by smk on 2016/12/6.
 * 权限管理路由
 */
var express=require('express');
var router=express.Router();
var crypto=require('crypto');//用于加密
var mongoose=require('mongoose');
var Hotel=mongoose.model('Hotel');
var UserGroup=mongoose.model('UserGroup');
var User=mongoose.model('User');
mongoose.Promise =global.Promise;//解决（mongoose's default promise library) is deprecated

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//用户组页面
router.get('/usergroup',checkLogin,function(req,res,next){
    Promise.all([
        UserGroup.find({},function(err,usergroups){
            if(err){
                console.log('find device err',err);
            }
            if(!usergroups){
                //throw new Error('列表为空');
                console.log('列表为空');
            }
        }),
        Hotel.find({},function(err,hotels){
            if(err){
                console.log('find hotel err',err);
            }
            if(!hotels){
                throw new Error('列表为空');
            }
        })
    ]).then(function(result){
        var usergroups=result[0];
        var hotels=result[1];

        res.render('authority/usergroup/index',{
            usergroups:usergroups,
            hotels:hotels
        })
    }).catch(next);

});
//新增用户组信息
router.post('/usergroup/add',checkLogin,function(req,res,next){
    var name=req.fields.name;
    var hotel=req.fields.hotel;
    var authority=req.fields.authority;
    var note=req.fields.note;

    //参数校验
    try{
        if(!name){
            throw new Error('请填写用户组名称');
        }
        if(!hotel){
            throw new Error('请填写所属酒店');
        }
    }catch(e){
        console.log('参数校验未通过');
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var usergroup=new UserGroup({
        name:name,
        hotel:hotel,
        authority:authority,
        note:note
    });

    usergroup.save(function(err){
        if(err){
            req.flash('error','新增失败');
            return res.redirect('back');
        }
        req.flash('success','新增成功');
        res.redirect('/authority/usergroup');
    });
});
//编辑用户组信息
router.get('/usergroup/:id/edit',checkLogin,function(req,res,next){

    var Id=req.params.id; //获取要编辑的项

    //查询选择项的信息
    UserGroup.findOne({_id:Id},function(err,usergroup){
        if(err){
            console.log('find err');
            return;
        }
        if(!usergroup){
            req.flash('error','该选择项不存在');
            res.redirect('/authority/usergroup');
        }
        return res.json(usergroup);  //将查询到的结果返回给页面
    });
});
//编辑用户组信息
router.post('/usergroup/:id/edit',checkLogin,function(req,res,next){
    var id=req.params.id;
    var name=req.fields.name_e;
    var hotel=req.fields.hotel_e;
    var authority=req.fields.authority_e;
    var note=req.fields.note_e;

    //参数校验
    try{
        if(!name){
            throw new Error('请填写用户组名称');
        }
        if(!hotel){
            throw new Error('请填写所属酒店');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var usergroup={
        name:name,
        hotel:hotel,
        authority:authority,
        note:note
    };

    UserGroup.update({_id:id},{$set:usergroup},function(err){
        if(err){
            console.log('err');
            req.flash('error','更新失败');
            return res.redirect('back');
        }
        req.flash('success','更新成功');
        res.redirect('/authority/usergroup');
    });
});
//删除用户组信息
router.post('/usergroup/remove',checkLogin,function(req,res,next){
    var selStr=req.fields._ids;  //获取ajax提交的data,暂时不知为何为string类型，req.fields为object
    var selJson=JSON.parse(selStr);  //将JSON字符串转换为JSON对象
    for(var i in selJson){    //采用JSON.parse()方法遍历得到要删除的选项
        UserGroup.remove({_id:selJson[i]},function(err){
            if(err){
                console.log('del err',err);
                return;
            }
        })
    }
    req.flash('success','删除成功');
    return res.json({'success':'删除成功'});
});

//用户管理页面
router.get('/user',checkLogin,function(req,res,next){
    Promise.all([
        User.find({},function(err,users){
            if(err){
                console.log('find device err',err);
            }
            if(!users){
                //throw new Error('列表为空');
                console.log('列表为空');
            }
        }),
        Hotel.find({},function(err,hotels){
            if(err){
                console.log('find hotel err',err);
            }
            if(!hotels){
                throw new Error('列表为空');
            }
        }),
        UserGroup.find({},function(err,usergroups){
            if(err){
                console.log('find device err',err);
            }
            if(!usergroups){
                //throw new Error('列表为空');
                console.log('列表为空');
            }
        })
    ]).then(function(result){
        var users=result[0];
        var hotels=result[1];
        var usergroups=result[2];

        res.render('authority/user/index',{
            users:users,
            hotels:hotels,
            usergroups:usergroups
        })
    }).catch(next);

});
//新增用户信息
router.post('/user/add',checkLogin,function(req,res,next){
    var userId=req.fields.userId;
    var userName=req.fields.userName;
    var md5 = crypto.createHash('md5');
    var userPassword = md5.update(req.fields.userPassword).digest('hex');
    var userSex=req.fields.userSex;
    var userPhone=req.fields.userPhone;
    var userHotelCode=req.fields.userHotelCode;
    var userClassCode=req.fields.userClassCode;
    var userStatus=req.fields.userStatus;
    var note=req.fields.note;

    //参数校验
    try{
        if(!userId){
            throw new Error('请填写用户组名称');
        }
        if(!userName){
            throw new Error('请填写所属酒店');
        }
    }catch(e){
        console.log('参数校验未通过');
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var user=new User({
        userId:userId,
        userName:userName,
        userPassword:userPassword,
        userSex:userSex,
        userPhone:userPhone,
        userHotelCode:userHotelCode,
        userClassCode:userClassCode,
        userStatus:userStatus,
        note:note
    });

    user.save(function(err){
        if(err){
            req.flash('error','新增失败');
            return res.redirect('back');
        }
        req.flash('success','新增成功');
        res.redirect('/authority/user');
    });
});
//编辑用户信息
router.get('/user/:id/edit',checkLogin,function(req,res,next){

    var id=req.params.id; //获取要编辑的项

    //查询选择项的信息
    User.findOne({_id:id},function(err,user){
        if(err){
            console.log('find err');
            return;
        }
        if(!user){
            req.flash('error','该选择项不存在');
            res.redirect('/authority/user');
        }
        return res.json(user);  //将查询到的结果返回给页面
    });
});
//编辑用户信息
router.post('/user/:id/edit',checkLogin,function(req,res,next){
    var id=req.params.id;
    var userName=req.fields.userName_e;
    var md5 = crypto.createHash('md5');
    var userPassword = md5.update(req.fields.userPassword_e).digest('hex');
    var userSex=req.fields.userSex_e;
    var userPhone=req.fields.userPhone_e;
    var userHotelCode=req.fields.userHotelCode_e;
    var userClassCode=req.fields.userClassCode_e;
    var userStatus=req.fields.userStatus_e;
    var note=req.fields.note_e;

    //参数校验
    try{
        if(!userName){
            throw new Error('请填写用户组名称');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var user={
        userName:userName,
        userPassword:userPassword,
        userSex:userSex,
        userPhone:userPhone,
        userHotelCode:userHotelCode,
        userClassCode:userClassCode,
        userStatus:userStatus,
        note:note
    };

    User.update({_id:id},{$set:user},function(err){
        if(err){
            console.log('err');
            req.flash('error','更新失败');
            return res.redirect('back');
        }
        req.flash('success','更新成功');
        res.redirect('/authority/user');
    });
});
//删除用户信息
router.post('/user/remove',checkLogin,function(req,res,next){
    var selStr=req.fields._ids;  //获取ajax提交的data,暂时不知为何为string类型，req.fields为object
    var selJson=JSON.parse(selStr);  //将JSON字符串转换为JSON对象
    for(var i in selJson){    //采用JSON.parse()方法遍历得到要删除的选项
        User.remove({_id:selJson[i]},function(err){
            if(err){
                console.log('del err',err);
                return;
            }
        })
    }
    req.flash('success','删除成功');
    return res.json({'success':'删除成功'});
});

module.exports=router;