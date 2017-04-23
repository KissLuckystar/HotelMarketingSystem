/**
 * Created by smk on 2016/12/6.
 * 配置管理路由
 */
var express=require('express');
var router=express.Router();

var mongoose=require('mongoose');
var Hotel=mongoose.model('Hotel');
var Device=mongoose.model('Device');
var Protocol=mongoose.model('Protocol');
var Group=mongoose.model('Group');
mongoose.Promise =global.Promise;//解决（mongoose's default promise library) is deprecated

var checkLogin=require('../middlewares/checkLogin').checkLogin;
var dbHelper = require('../middlewares/dbHelper');

//酒店管理页面
router.get('/hotel',checkLogin,function(req,res,next){
    res.render('collocation/hotel/index');
});
//查询酒店列表，条件查询
router.post('/hotel/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_hotel=req.fields.search_hotel;   //记录数
    if(search_hotel){
        var hotel_name=new RegExp(search_hotel, 'i');   //不区分大小写
        var queryParams={
            hotel_name:{$regex : hotel_name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,Hotel,'',queryParams,{},function(error,$page){
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
        dbHelper.pageQuery(page,rows,Hotel,'',{},{},function(error,$page){
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
//新增酒店信息
router.post('/hotel/add',checkLogin,function(req,res,next){
    var hotel_name=req.fields.hotel_name;
    var hotel_address=req.fields.hotel_address;
    var phone=req.fields.phone;
    var note=req.fields.note;
    var data={
        state : 0,
    };
    var hotel=new Hotel({
        hotel_name:hotel_name,
        hotel_address:hotel_address,
        phone:phone,
        note:note
    });
    hotel.save(function(err){
        if(err){
            console.log('error','新增失败');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//获取要编辑的酒店信息
router.post('/hotel/edit',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    console.log(id);
    //查询选择项的信息
    Hotel.findOne({_id:id},function(err,hotel){
        if(err){
            console.log('find err');
            return;
        }
        if(!hotel){
            console.log('error','该选择项不存在');
        }
        return res.json(hotel);
    });
});
//编辑酒店信息
router.post('/hotel/update',checkLogin,function(req,res,next){
    var id=req.fields.id;
    var hotel_name=req.fields.hotel_name;
    var hotel_address=req.fields.hotel_address;
    var phone=req.fields.phone;
    var note=req.fields.note;
    var data={
        state : 0,
    };
    var hotel={
        hotel_name:hotel_name,
        hotel_address:hotel_address,
        phone:phone,
        note:note
    };
    Hotel.update({_id:id},{$set:hotel},function(err){
        if(err){
            console.log('err');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//删除酒店信息
router.post('/hotel/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        Hotel.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});
//班组管理
router.get('/group',function(req,res,next){
    Promise.all([
        Group.find({},function(err,groups){
            if(err){
                console.log('find device err',err);
            }
            if(!groups){
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
    ]).then(function(result){
        var groups=result[0];
        var hotels=result[1];

        res.render('collocation/group/index',{
            groups:groups,
            hotels:hotels
        })
    }).catch(next);
});

//新增班组信息
router.post('/group/add',checkLogin,function(req,res,next){
    var name=req.fields.name;
    var hotel=req.fields.hotel;
    var group_code=req.fields.group_code;
    var begin_time=req.fields.begin_time;
    var end_time=req.fields.end_time;
    var note=req.fields.note;

    //参数校验
    try{
        if(!name){
            throw new Error('请填写酒店名称');
        }
        if(!hotel){
            throw new Error('请填写酒店地址');
        }
        if(!group_code){
            throw new Error('请填写酒店电话');
        }
    }catch(e){
        console.log('参数校验未通过');
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var group=new Group({
        name:name,
        hotel:hotel,
        group_code:group_code,
        begin_time:begin_time,
        end_time:end_time,
        note:note
    });

    group.save(function(err){
        if(err){
            req.flash('error','新增失败');
            return res.redirect('back');
        }
        req.flash('success','新增成功');
        res.redirect('/collocation/group');
    });
});
//编辑班组信息
router.get('/group/:groupId/edit',checkLogin,function(req,res,next){

    var groupId=req.params.groupId; //获取要编辑的项

    //查询选择项的信息
    Group.findOne({_id:groupId},function(err,group){
        if(err){
            console.log('find err');
            return;
        }
        if(!group){
            req.flash('error','该选择项不存在');
            res.redirect('/collocation/group');
        }
        return res.json(group);  //将查询到的结果返回给页面
    });
});
//编辑班组信息
router.post('/group/:groupId/edit',checkLogin,function(req,res,next){
    var groupId=req.params.groupId;
    var name=req.fields.name_e;
    var hotel=req.fields.hotel_e;
    var group_code=req.fields.group_code_e;
    var begin_time=req.fields.begin_time_e;
    var end_time=req.fields.end_time_e;
    var note=req.fields.note_e;

    //参数校验
    try{
        if(!name){
            throw new Error('请填写酒店名称');
        }
        if(!hotel){
            throw new Error('请填写酒店地址');
        }
        if(!group_code){
            throw new Error('请填写酒店电话');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var group=new Group({
        name:name,
        hotel:hotel,
        group_code:group_code,
        begin_time:begin_time,
        end_time:end_time,
        note:note
    });

    Hotel.update({_id:groupId},{$set:group},function(err){
        if(err){
            console.log('err');
            req.flash('error','更新失败');
            return res.redirect('back');
        }
        req.flash('success','更新成功');
        res.redirect('/collocation/hotel');
    });
});
//删除班组信息
router.post('/group/remove',checkLogin,function(req,res,next){
    var selStr=req.fields._ids;  //获取ajax提交的data,暂时不知为何为string类型，req.fields为object
    var selJson=JSON.parse(selStr);  //将JSON字符串转换为JSON对象
    for(var i in selJson){    //采用JSON.parse()方法遍历得到要删除的选项
        Group.remove({_id:selJson[i]},function(err){
            if(err){
                console.log('del err',err);
                return;
            }
        })
    }
    req.flash('success','删除成功');
    return res.json({'success':'删除成功'});
});

//协议管理
router.get('/protocol',function(req,res,next){
    //查询协议信息，并显示
    Protocol.find({},function(err,protocols){
        if(err){
            console.log('find hotel err',err);
        }
        if(!protocols){
            throw new Error('列表为空');
        }
        res.render('collocation/protocol/index',{
            protocols:protocols
        });
    });
});
//新增协议信息
router.post('/protocol/add',checkLogin,function(req,res,next){
    var title=req.fields.title;
    var content=req.fields.content;
    var note=req.fields.note;

    //参数校验
    try{
        if(!title){
            throw new Error('请填写协议标题');
        }
        if(!content){
            throw new Error('请填写协议内容');
        }
    }catch(e){
        console.log('参数校验未通过');
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var protocol=new Protocol({
        title:title,
        content:content,
        note:note
    });

    protocol.save(function(err){
        if(err){
            req.flash('error','新增失败');
            return res.redirect('back');
        }
        req.flash('success','新增成功');
        res.redirect('/collocation/protocol');
    });
});
//编辑协议信息
router.get('/protocol/:protocolId/edit',checkLogin,function(req,res,next){

    var protocolId=req.params.protocolId; //获取要编辑的项

    //查询选择项的信息
    Protocol.findOne({_id:protocolId},function(err,protocol){
        if(err){
            console.log('find err');
            return;
        }
        if(!protocol){
            req.flash('error','该选择项不存在');
            res.redirect('/collocation/protocol');
        }
        return res.json(protocol);  //将查询到的结果返回给页面
    });
});
//编辑协议信息
router.post('/protocol/:protocolId/edit',checkLogin,function(req,res,next){
    var protocolId=req.params.protocolId;
    var title=req.fields.title_e;
    var content=req.fields.content_e;
    var note=req.fields.note_e;

    //参数校验
    try{
        if(!title){
            throw new Error('请填写协议标题');
        }
        if(!content){
            throw new Error('请填写协议内容');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var protocol={
        title:title,
        content:content,
        note:note
    };

    Protocol.update({_id:protocolId},{$set:protocol},function(err){
        if(err){
            console.log('err');
            req.flash('error','更新失败');
            return res.redirect('back');
        }
        req.flash('success','更新成功');
        res.redirect('/collocation/protocol');
    });
});
//删除协议信息
router.post('/protocol/remove',checkLogin,function(req,res,next){
    var selStr=req.fields._ids;  //获取ajax提交的data,暂时不知为何为string类型，req.fields为object
    //console.log(typeof(selStr));
    var selJson=JSON.parse(selStr);  //将JSON字符串转换为JSON对象
    //console.log(selJson+' '+typeof(selJson));
    for(var i in selJson){    //采用JSON.parse()方法遍历得到要删除的选项
        Protocol.remove({_id:selJson[i]},function(err){
            if(err){
                console.log('del err',err);
                return;
            }
        })
    }
    req.flash('success','删除成功');
    return res.json({'success':'删除成功'});
});


//设备管理
router.get('/equipment',function(req,res,next){
    //查询设备和酒店信息，并显示
    Promise.all([
        Device.find({},function(err,devices){
            if(err){
                console.log('find device err',err);
            }
            if(!devices){
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
    ]).then(function(result){
        var devices=result[0];
        var hotels=result[1];

        res.render('collocation/equipment/index',{
            devices:devices,
            hotels:hotels
        })
    }).catch(next);

});
//新增设备信息
router.post('/equipment/add',checkLogin,function(req,res,next){
    var device_hotel=req.fields.device_hotel;
    var device_num=req.fields.device_num;
    var device_mac=req.fields.device_mac;
    var device_status=req.fields.device_status;
    var note=req.fields.note;

    //参数校验
    try{
        if(!device_num){
            throw new Error('请填写设备编号');
        }
        if(!device_mac){
            throw new Error('请填写设备MAC地址');
        }
    }catch(e){
        console.log('参数校验未通过');
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var device=new Device({
        device_hotel:device_hotel,
        device_num:device_num,
        device_mac:device_mac,
        device_status:device_status,
        note:note
    });

    device.save(function(err){
        if(err){
            req.flash('error','新增失败');
            return res.redirect('back');
        }
        req.flash('success','新增成功');
        res.redirect('/collocation/equipment');
    });
});
//编辑设备信息
router.get('/equipment/:deviceId/edit',checkLogin,function(req,res,next){

    var deviceId=req.params.deviceId; //获取要编辑的项

    //查询选择项的信息
    Device.findOne({_id:deviceId},function(err,device){
        if(err){
            console.log('find err');
            return;
        }
        if(!device){
            req.flash('error','该选择项不存在');
            res.redirect('/collocation/equipment');
        }
        //console.log(hotel);
        //res.render('')
        return res.json(device);  //将查询到的结果返回给页面
    });
});
//编辑酒店信息
router.post('/equipment/:deviceId/edit',checkLogin,function(req,res,next){
    var deviceId=req.params.deviceId;
    var device_hotel=req.fields.device_hotel_e;
    var device_num=req.fields.device_num_e;
    var device_mac=req.fields.device_mac_e;
    var device_status=req.fields.device_status_e;
    var note=req.fields.note_e;

    //参数校验
    try{
        if(!device_num){
            throw new Error('请填写设备编号');
        }
        if(!device_mac){
            throw new Error('请填写设备MAC地址');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var device={
        device_hotel:device_hotel,
        device_num:device_num,
        device_mac:device_mac,
        device_status:device_status,
        note:note
    };

    Device.update({_id:deviceId},{$set:device},function(err){
        if(err){
            console.log('err');
            req.flash('error','更新失败');
            return res.redirect('back');
        }
        req.flash('success','更新成功');
        res.redirect('/collocation/equipment');
    });
});
//删除设备信息
router.post('/equipment/remove',checkLogin,function(req,res,next){
    var selStr=req.fields._ids;  //获取ajax提交的data,暂时不知为何为string类型，req.fields为object
    var selJson=JSON.parse(selStr);  //将JSON字符串转换为JSON对象
    for(var i in selJson){    //采用JSON.parse()方法遍历得到要删除的选项
        //console.log(selJson[i]);
        Device.remove({_id:selJson[i]},function(err){
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
