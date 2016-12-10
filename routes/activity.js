/**
 * Created by smk on 2016/12/9.
 */
var express=require('express');
var router=express.Router();
var path=require('path');
var mongoose=require('mongoose');
var Activity=mongoose.model('Activity');
mongoose.Promise =global.Promise;//解决（mongoose's default promise library) is deprecated

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//用户组页面
router.get('/marketingactive',checkLogin,function(req,res,next){
    Activity.find({})
        .populate({path:'publisher',model:'User'})
        .sort({_id:1})
        .exec(function(err,activitys){
            if(err){
                console.log('find hotel err',err);
            }
            if(!activitys){
                res.render('marketinginfo/marketingactive/index',{
                    activitys:{}
                });
            }
            res.render('marketinginfo/marketingactive/index',{
                activitys:activitys
            });
        });
});
//新增用户组信息
router.post('/marketingactive/add',checkLogin,function(req,res,next){
    var publisher=req.session.user._id;
    var title=req.fields.title;
    var content=req.fields.content;
    var file=req.files.file.path.split(path.sep).pop();
    var status=req.fields.status;

    //存储各种时间格式，方便扩展
    var date=new Date();
    var time={
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear()+'-'+(date.getMonth()+1),
        day:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
        minute:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+
        (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes())
    };

    //参数校验
    try{
        if(!title){
            throw new Error('请填写用户组名称');
        }
        if(!content){
            throw new Error('请填写所属酒店');
        }
    }catch(e){
        console.log('参数校验未通过');
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var activity=new Activity({
        publisher:publisher,
        title:title,
        content:content,
        file:file,
        status:status,
        create_time:time.minute
    });

    //console.log(activity);

    activity.save(function(err){
        if(err){
            console.log('保存失败');
            req.flash('error','新增失败');
            return res.redirect('back');
        }
        console.log('保存成功');
        req.flash('success','新增成功');
        res.redirect('/marketinginfo/marketingactive');
    });
});
//编辑用户组信息
router.get('/marketingactive/:id/edit',checkLogin,function(req,res,next){

    var Id=req.params.id; //获取要编辑的项

    //查询选择项的信息
    Activity.findOne({_id:Id},function(err,activity){
        if(err){
            console.log('find err');
            return;
        }
        if(!activity){
            req.flash('error','该选择项不存在');
            res.redirect('/marketinginfo/marketingactive');
        }
        return res.json(activity);  //将查询到的结果返回给页面
    });
});
//编辑用户组信息
router.post('/marketingactive/:id/edit',checkLogin,function(req,res,next){
    var id=req.params.id;
    var title=req.fields.title_e;
    var content=req.fields.content_e;
    var file=req.files.file_e.path.split(path.sep).pop();
    var status=req.fields.status_e;

    //参数校验
    try{
        if(!title){
            throw new Error('请填写用户组名称');
        }
        if(!content){
            throw new Error('请填写所属酒店');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var activity={
        title:title,
        content:content,
        file:file,
        status:status
    };

    Activity.update({_id:id},{$set:activity},function(err){
        if(err){
            console.log('err');
            req.flash('error','更新失败');
            return res.redirect('back');
        }
        req.flash('success','更新成功');
        res.redirect('/marketinginfo/marketingactive');
    });
});
//删除用户组信息
router.post('/marketingactive/remove',checkLogin,function(req,res,next){
    var selStr=req.fields._ids;  //获取ajax提交的data,暂时不知为何为string类型，req.fields为object
    var selJson=JSON.parse(selStr);  //将JSON字符串转换为JSON对象
    for(var i in selJson){    //采用JSON.parse()方法遍历得到要删除的选项
        Activity.remove({_id:selJson[i]},function(err){
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