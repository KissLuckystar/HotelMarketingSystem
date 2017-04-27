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
//查询酒店列表，查询所有
router.get('/hotel/all',checkLogin,function(req,res,next){
    //查询酒店的信息
    Hotel.find({},function(err,hotels){
        if(err){
            console.log(err);
            return;
        }
        if(!hotels){
            console.log('酒店列表为空');
            return;
        }
        res.json(hotels);
    });
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
/**
 * 班组管理路由控制
 */
//班组管理页面
router.get('/group',checkLogin,function(req,res,next){
    res.render('collocation/group/index');
});
//查询班组列表，条件查询
router.post('/group/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_group=req.fields.search_group;
    var populate = "hotel_id";   //格式为字符串，用于populate查询
    if(search_group){
        var group_name=new RegExp(search_group, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : group_name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,Group,populate,queryParams,{},function(error,$page){
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
        dbHelper.pageQuery(page,rows,Group,populate,{},{},function(error,$page){
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
//新增班组信息
router.post('/group/add',checkLogin,function(req,res,next){
    var name=req.fields.name;
    var hotel_id=req.fields.hotel_id;
    var begin_time=req.fields.begin_time;
    var end_time=req.fields.end_time;
    var note=req.fields.note;
    var data={
        state : 0,
    };
    var group=new Group({
        name:name,
        hotel_id:hotel_id,
        begin_time:begin_time,
        end_time:end_time,
        note:note
    });
    //console.log('group:',group);
    group.save(function(err){
        if(err){
            console.log('error','新增失败');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//获取要编辑的班组信息
router.post('/group/edit',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    //查询选择项的信息
    Group.findOne({_id:id}).populate('hotel_id').exec(function(err,group){
        if(err){
            console.log('find err');
            return;
        }
        if(!group){
            console.log('error','该选择项不存在');
            return;
        }
        return res.json(group);
    });
});
//编辑班组信息
router.post('/group/update',checkLogin,function(req,res,next){
    var id=req.fields.id;
    var name=req.fields.name;
    var hotel_id=req.fields.hotel_id;
    var begin_time=req.fields.begin_time;
    var end_time=req.fields.end_time;
    var note=req.fields.note;
    var data={
        state : 0,
    };
    var group={
        name:name,
        hotel_id:hotel_id,
        begin_time:begin_time,
        end_time:end_time,
        note:note
    };
    //console.log('update group:',group);
    Group.update({_id:id},{$set:group},function(err){
        if(err){
            console.log('err');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//删除班组信息
router.post('/group/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        Group.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});
/**
 * 协议管理路由控制
 */
//协议管理页面
router.get('/protocol',checkLogin,function(req,res,next){
    res.render('collocation/protocol/index');
});
//查询协议列表，条件查询
router.post('/protocol/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_protocol=req.fields.search_protocol;
    var populate = "user_id";   //格式为字符串，用于populate查询
    if(search_protocol){
        var protocol_name=new RegExp(search_protocol, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : protocol_name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,Protocol,populate,queryParams,{},function(error,$page){
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
        dbHelper.pageQuery(page,rows,Protocol,populate,{},{},function(error,$page){
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
//新增协议信息
router.post('/protocol/add',checkLogin,function(req,res,next){
    var name=req.fields.name;
    var content=req.fields.content;
    var user_id=req.session.user._id;
    var note=req.fields.note;
    var data={
        state : 0,
    };
    var protocol=new Protocol({
        name:name,
        content:content,
        user_id:user_id,
        note:note
    });
    //console.log('group:',group);
    protocol.save(function(err){
        if(err){
            console.log('error','新增失败');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//获取要编辑的协议信息
router.post('/protocol/edit',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    //查询选择项的信息
    Protocol.findOne({_id:id}).populate('user_id').exec(function(err,protocol){
        if(err){
            console.log('find err');
            return;
        }
        if(!protocol){
            console.log('error','该选择项不存在');
            return;
        }
        return res.json(protocol);
    });
});
//编辑协议信息
router.post('/protocol/update',checkLogin,function(req,res,next){
    var id=req.fields.id;
    var name=req.fields.name;
    var content=req.fields.content;
    var note=req.fields.note;
    var data={
        state : 0
    };
    var protocol={
        name:name,
        content:content,
        note:note
    };
    //console.log('update group:',group);
    Protocol.update({_id:id},{$set:protocol},function(err){
        if(err){
            console.log('err');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//删除协议信息
router.post('/protocol/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        Protocol.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});
/**
 * 设备管理路由控制
 */
//设备管理页面
router.get('/device',checkLogin,function(req,res,next){
    res.render('collocation/device/index');
});
//查询设备列表，条件查询
router.post('/device/data',checkLogin,function(req,res,next){
    var page=req.fields.page;   //页数
    var rows=req.fields.rows;   //记录数
    var search_device=req.fields.search_device;
    var populate = "hotel_id";   //格式为字符串，用于populate查询
    if(search_device){
        var device_name=new RegExp(search_device, 'i');   //不区分大小写
        var queryParams={
            name:{$regex : device_name}
        };
        /**
         * $page对象包含三个属性：pageNumber:当前页数（从1开始）；pageCount：总页数；length：总记录数；results:当前页的记录
         * page默认从1开始，计算skip的参数为(page-1)*rows
         * 往前台返回的数据不仅要返回分页后的数据，还要返回数据的总数
         */
        dbHelper.pageQuery(page,rows,Device,populate,queryParams,{},function(error,$page){
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
        dbHelper.pageQuery(page,rows,Device,populate,{},{},function(error,$page){
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
//新增设备信息
router.post('/device/add',checkLogin,function(req,res,next){
    var name=req.fields.name;
    var mac=req.fields.mac;
    var hotel_account=req.fields.hotel_account;
    var hotel_id=req.fields.hotel_id;
    var state=req.fields.state;
    var note=req.fields.note;
    var data={
        state : 0,
    };
    var device=new Device({
        name:name,
        mac:mac,
        hotel_account:hotel_account,
        hotel_id:hotel_id,
        state:state,
        note:note
    });
    //console.log('group:',group);
    device.save(function(err){
        if(err){
            console.log('error','新增失败');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//获取要编辑的设备信息
router.post('/device/edit',checkLogin,function(req,res,next){
    var id=req.fields.id; //获取要编辑的项
    //查询选择项的信息
    Device.findOne({_id:id}).populate('hotel_id').exec(function(err,device){
        if(err){
            console.log('find err');
            return;
        }
        if(!device){
            console.log('error','该选择项不存在');
            return;
        }
        return res.json(device);
    });
});
//编辑设备信息
router.post('/device/update',checkLogin,function(req,res,next){
    var id=req.fields.id;
    var name=req.fields.name;
    var mac=req.fields.mac;
    var hotel_account=req.fields.hotel_account;
    var hotel_id=req.fields.hotel_id;
    var state=req.fields.state;
    var note=req.fields.note;
    var data={
        state : 0
    };
    var device={
        name:name,
        mac:mac,
        hotel_account:hotel_account,
        hotel_id:hotel_id,
        state:state,
        note:note
    };
    //console.log('update group:',group);
    Device.update({_id:id},{$set:device},function(err){
        if(err){
            console.log('err');
            return res.send(data);
        }
        data.state=1;
        return res.send(data);
    });
});
//删除设备信息
router.post('/device/remove',checkLogin,function(req,res,next){
    var idStr=req.fields.ids;
    var ids=idStr.split(',');
    for(var i = 0; i < ids.length ; i++ ){
        Device.remove({_id:ids[i]},function(err){
            if(err){
                console.log('del err',err);
                return res.json({'affected_rows':0});
            }
        })
    }
    return res.json({'affected_rows':ids.length});
});



module.exports=router;
