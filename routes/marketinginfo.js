/**
 * Created by smk on 2016/12/9.
 * 营销信息模块
 */
var express=require('express');
var router=express.Router();
var path=require('path');
var mongoose=require('mongoose');
var Activity=mongoose.model('Activity');
mongoose.Promise =global.Promise;//解决（mongoose's default promise library) is deprecated

var checkLogin=require('../middlewares/checkLogin').checkLogin;
var dbHelper = require('../middlewares/dbHelper');

//营销活动管理界面
router.get('/activity',function(req,res){
    res.render('marketinginfo/marketingactivity/index');
});

//查询营销活动列表，条件查询
router.post('/activity/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_activity=req.fields.search_activity;   //记录数

    var populate = "publisher";   //格式为字符串，用于populate查询

    if(search_activity){
        var title=new RegExp(search_activity, 'i');   //不区分大小写
        var queryParams={
            title:{$regex : title}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,Activity,populate,queryParams,{},function(error,$page){
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
        dbHelper.pageQuery(page,rows,Activity,populate,{},{},function(error,$page){
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
//新增营销活动信息
router.post('/activity/add',function(req,res,next){
    var publisher = req.session.user._id;
    var title =req.fields.title;
    var content = req.fields.content;
    var picture = req.files.picture.path.split(path.sep).pop();
    var state = req.fields.state;
    var beginTime = new Date(req.fields.begin_time);
    //console.log('beginTime:',beginTime);
    //console.log('new beginTime:',new Date(beginTime));
    //console.log('After beginTime:',dbHelper.timeFormat(beginTime).minute);
    var endTime = new Date(req.fields.end_time);
    var data={
        state : 0,
    };
    //创建
    var activity=new Activity({
        publisher:publisher,
        title:title,
        content:content,
        file:picture,
        state:state,
        begin_time:beginTime,
        end_time:endTime,
    });
    console.log(activity);
    activity.save(function(err){
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
//获取要编辑的营销活动信息
router.post('/activity/edit',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    //查询选择项的信息
    Activity.findOne({_id:id}).populate('publisher').exec(function(err,activity){
        if(err){
            console.log('find err');
            return;
        }
        if(!activity){
            console.log('error','该选择项不存在');
            return;
        }
        return res.json(activity);
    });
});
//编辑营销活动信息
router.post('/activity/update',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var content = req.fields.content_edit;
    var state = req.fields.state_edit;
    var beginTime = new Date(req.fields.begin_time_edit);
    var endTime = new Date(req.fields.end_time_edit);
    var picture = "";
    if(req.files.picture_edit.name){
        picture = req.files.picture_edit.path.split(path.sep).pop();
    }
    var activity={
        content:content,
        state:state,
        begin_time:beginTime,
        end_time:endTime
    };
    if(picture){
        activity.file=picture;
    }
    Activity.update({_id:id},{$set:activity},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});
//删除酒店信息
router.post('/activity/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        Activity.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});
//修改营销活动状态，上线
router.post('/activity/online',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var activity={
        state:'已上线'
    };
    Activity.update({_id:id},{$set:activity},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});
//修改营销活动状态，下线
router.post('/activity/offline',checkLogin,function(req,res,next){
    var id = req.fields.id;
    var activity={
        state:'已下线'
    };
    Activity.update({_id:id},{$set:activity},function(err, numberAffected, raw){
        if(err){
            console.log('err');
            return res.send({ state:0 });
        }
        return res.send({ state:1 });
    });
});

module.exports=router;