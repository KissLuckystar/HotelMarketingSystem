/**
 * Created by smk on 2016/12/6.
 * 配置管理路由
 */
var express=require('express');
var router=express.Router();

var mongoose=require('mongoose');
var Hotel=mongoose.model('Hotel');
mongoose.Promise =global.Promise;//解决（mongoose's default promise library) is deprecated

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//酒店管理页面
router.get('/hotel',checkLogin,function(req,res,next){
    //查询酒店信息，并显示
    Hotel.find({},function(err,hotels){
        if(err){
            console.log('find hotel err',err);
        }
        if(!hotels){
            throw new Error('列表为空');
        }
        res.render('collocation/hotel/index',{
            hotels:hotels
        });
    });

});
//新增酒店信息
router.post('/hotel/add',checkLogin,function(req,res,next){
    var hotel_name=req.fields.hotel_name;
    var hotel_address=req.fields.hotel_address;
    var phone=req.fields.phone;
    var note=req.fields.note;

    //参数校验
    try{
        if(!hotel_name){
            throw new Error('请填写酒店名称');
        }
        if(!hotel_address){
            throw new Error('请填写酒店地址');
        }
        if(!phone){
            throw new Error('请填写酒店电话');
        }
    }catch(e){
        console.log('参数校验未通过');
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var hotel=new Hotel({
        hotel_name:hotel_name,
        hotel_address:hotel_address,
        phone:phone,
        note:note
    });

    hotel.save(function(err){
        if(err){
            req.flash('error','新增失败');
            return res.redirect('back');
        }
        req.flash('success','新增成功');
        res.redirect('/collocation/hotel');
    });
});
//编辑酒店信息
router.get('/hotel/:hotelId/edit',function(req,res,next){

    var hotelId=req.params.hotelId; //获取要编辑的项
    console.log(hotelId);

    //查询选择项的信息
    Hotel.findOne({_id:hotelId},function(err,hotel){
        if(err){
            console.log('find err');
            return;
        }
        if(!hotel){
            req.flash('error','该选择项不存在');
            res.redirect('/collocation/hotel');
        }
        //console.log(hotel);
        //res.render('')
        return res.json(hotel);  //将查询到的结果返回给页面
    });
});
//编辑酒店信息
router.post('/hotel/:hotelId/edit',function(req,res,next){
    var hotelId=req.params.hotelId;
    var hotel_name=req.fields.hotel_name_e;
    var hotel_address=req.fields.hotel_address_e;
    var phone=req.fields.phone_e;
    var note=req.fields.note_e;

    //参数校验
    try{
        if(!hotel_name){
            throw new Error('请填写酒店名称');
        }
        if(!hotel_address){
            throw new Error('请填写酒店地址');
        }
        if(!phone){
            throw new Error('请填写酒店电话');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var hotel={
        hotel_name:hotel_name,
        hotel_address:hotel_address,
        phone:phone,
        note:note
    };

    Hotel.update({_id:hotelId},{$set:hotel},function(err){
        if(err){
            console.log('err');
            req.flash('error','更新失败');
            return res.redirect('back');
        }
        req.flash('success','更新成功');
        res.redirect('/collocation/hotel');
    });
});
//删除酒店信息
router.post('/hotel/remove',function(req,res,next){
    var selStr=req.fields._ids;  //获取ajax提交的data,暂时不知为何为string类型，req.fields为object
    //console.log(typeof(selStr));
    var selJson=JSON.parse(selStr);  //将JSON字符串转换为JSON对象
    //console.log(selJson+' '+typeof(selJson));
    for(var i in selJson){    //采用JSON.parse()方法遍历得到要删除的选项
        //console.log(selJson[i]);
        Hotel.remove({_id:selJson[i]},function(err){
            if(err){
                console.log('del err',err);
                return;
            }
        })
    }
    //console.log(req.params);  //为空
    //console.log(req.body);    //为空
    //console.log(req.query);   //为空
    req.flash('success','删除成功');
    //res.redirect('/collocation/hotel');
    return res.json({'success':'删除成功'});
});
//班组管理
router.get('/group',function(req,res,next){
    res.render('collocation/group/index');
});
//协议管理
router.get('/protocol',function(req,res,next){
    res.render('collocation/protocol/index');
});
//设备管理
router.get('/equipment',function(req,res,next){
    res.render('collocation/equipment/index');
});







module.exports=router;
