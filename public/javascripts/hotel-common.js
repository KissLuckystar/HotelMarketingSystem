/**
 * Created by smk on 2016/12/7.
 * 存放系统中用到的JS工具类
 */
$(function(){
    //列表选项的全选与取消全选
    $('#sel').click(function(){
        if(this.checked){
            //console.log($('input:checkbox:checked').val());
            $('.td_sel').prop('checked',true);
        }else{
            $('.td_sel').prop('checked',false);
        }
    });
    //酒店信息编辑
    $('#edit_hotel').click(function(){
        var selList=getChecked(); //获取到已选择项的value值
        if(selList.length==0){
            alert('请选择要编辑的选项！');
        }else if(selList.length>1){
            alert('请选择一项进行编辑！');
        }else{
            $.ajax({
                url:'/collocation/hotel/'+selList[0]+'/edit',
                type:'GET',//POST,GET
                async:true,//是否异步
                data:{_id:selList[0]},
                dataType:'json',
                success:function(data){
                    //console.log(data.hotel_address);
                    $('#hotel_name_e').val(data.hotel_name);
                    $('#hotel_address_e').val(data.hotel_address);
                    $('#phone_e').val(data.phone);
                    $('#note_e').val(data.note);
                    //设置form的action地址
                    $('#editForm').attr('action','/collocation/hotel/'+data._id+'/edit');  //设置form表单的action地址
                    $('#editModal').modal('show');
                },
                error:function(xhr,textStatus){
                    console.log(xhr+textStatus);
                }
            })
        }
    });

    //设备信息编辑
    $('#edit_device').click(function(){
        var selList=getChecked(); //获取到已选择项的value值
        if(selList.length==0){
            alert('请选择要编辑的选项！');
        }else if(selList.length>1){
            alert('请选择一项进行编辑！');
        }else{
            $.ajax({
                url:'/collocation/equipment/'+selList[0]+'/edit',
                type:'GET',//POST,GET
                async:true,//是否异步
                data:{_id:selList[0]},
                dataType:'json',
                success:function(data){
                    //console.log(data.hotel_address);
                    $('#device_hotel_e').val(data.device_hotel);
                    $('#device_num_e').val(data.device_num);
                    $('#device_mac_e').val(data.device_mac);
                    if(!data.device_status){
                        $('#device_no_e').attr('checked',true);
                    }
                    $('#note_e').val(data.note);
                    //设置form的action地址
                    $('#editForm').attr('action','/collocation/equipment/'+data._id+'/edit');  //设置form表单的action地址
                    $('#editModal').modal('show');
                },
                error:function(xhr,textStatus){
                    console.log(xhr+textStatus);
                }
            })
        }
    });


    //协议信息编辑
    $('#edit_protocol').click(function(){
        var selList=getChecked(); //获取到已选择项的value值
        if(selList.length==0){
            alert('请选择要编辑的选项！');
        }else if(selList.length>1){
            alert('请选择一项进行编辑！');
        }else{
            $.ajax({
                url:'/collocation/protocol/'+selList[0]+'/edit',
                type:'GET',//POST,GET
                async:true,//是否异步
                data:{_id:selList[0]},
                dataType:'json',
                success:function(data){
                    $('#title_e').val(data.title);
                    $('#content_e').val(data.content);
                    $('#note_e').val(data.note);
                    //设置form的action地址
                    $('#editForm').attr('action','/collocation/protocol/'+data._id+'/edit');  //设置form表单的action地址
                    $('#editModal').modal('show');
                },
                error:function(xhr,textStatus){
                    console.log(xhr+textStatus);
                }
            })
        }
    });


    //班组信息编辑
    $('#edit_group').click(function(){
        var selList=getChecked(); //获取到已选择项的value值
        if(selList.length==0){
            alert('请选择要编辑的选项！');
        }else if(selList.length>1){
            alert('请选择一项进行编辑！');
        }else{
            $.ajax({
                url:'/collocation/group/'+selList[0]+'/edit',
                type:'GET',//POST,GET
                async:true,//是否异步
                data:{_id:selList[0]},
                dataType:'json',
                success:function(data){
                    $('#name_e').val(data.name);
                    $('#hotel_e').val(data.hotel);
                    $('#group_code_e').val(data.group_code);
                    $('#begin_time_e').val(data.begin_time);
                    $('#end_time_e').val(data.end_time);
                    $('#note_e').val(data.note);
                    //设置form的action地址
                    $('#editForm').attr('action','/collocation/group/'+data._id+'/edit');  //设置form表单的action地址
                    $('#editModal').modal('show');
                },
                error:function(xhr,textStatus){
                    console.log(xhr+textStatus);
                }
            })
        }
    });

    //用户组信息编辑
    $('#edit_usergroup').click(function(){
        var selList=getChecked(); //获取到已选择项的value值
        if(selList.length==0){
            alert('请选择要编辑的选项！');
        }else if(selList.length>1){
            alert('请选择一项进行编辑！');
        }else{
            $.ajax({
                url:'/authority/usergroup/'+selList[0]+'/edit',
                type:'GET',//POST,GET
                async:true,//是否异步
                data:{_id:selList[0]},
                dataType:'json',
                success:function(data){
                    $('#name_e').val(data.name);
                    $('#hotel_e').val(data.hotel);
                    $('#authority_e').val(data.authority);
                    $('#note_e').val(data.note);
                    //设置form的action地址
                    $('#editForm').attr('action','/authority/usergroup/'+data._id+'/edit');  //设置form表单的action地址
                    $('#editModal').modal('show');
                },
                error:function(xhr,textStatus){
                    console.log(xhr+textStatus);
                }
            })
        }
    });

    //用户信息编辑
    $('#edit_user').click(function(){
        var selList=getChecked(); //获取到已选择项的value值
        if(selList.length==0){
            alert('请选择要编辑的选项！');
        }else if(selList.length>1){
            alert('请选择一项进行编辑！');
        }else{
            $.ajax({
                url:'/authority/user/'+selList[0]+'/edit',
                type:'GET',//POST,GET
                async:true,//是否异步
                data:{_id:selList[0]},
                dataType:'json',
                success:function(data){
                    $('#userName_e').val(data.userName);
                    $('#userId_e').val(data.userId);
                    $('#userPassword_e').val(data.userPassword);
                    if(data.userSex=='f'){
                        $('#female_e').attr('checked',true);
                    }
                    $('#userPhone_e').val(data.userPhone);
                    $('#userHotelCode_e').val(data.userHotelCode);
                    $('#userClassCode_e').val(data.userClassCode);
                    if(data.userStatus=='n'){
                        $('#userStatus_n_e').attr('checked',true);
                    }
                    $('#userStatus_e').val(data.userStatus);
                    $('#note_e').val(data.note);
                    //设置form的action地址
                    $('#editForm').attr('action','/authority/user/'+data._id+'/edit');  //设置form表单的action地址
                    $('#editModal').modal('show');
                },
                error:function(xhr,textStatus){
                    console.log(xhr+textStatus);
                }
            })
        }
    });


    //营销信息编辑
    $('#edit_activeinfo').click(function(){
        var selList=getChecked(); //获取到已选择项的value值
        if(selList.length==0){
            alert('请选择要编辑的选项！');
        }else if(selList.length>1){
            alert('请选择一项进行编辑！');
        }else{
            $.ajax({
                url:'/marketinginfo/marketingactive/'+selList[0]+'/edit',
                type:'GET',//POST,GET
                async:true,//是否异步
                data:{_id:selList[0]},
                dataType:'json',
                success:function(data){
                    $('#title_e').val(data.title);
                    $('#content_e').val(data.content);
                    if(data.status=='y'){
                        $('#status_y_e').attr('checked',true);
                    }else if(data.status=='n'){
                        $('#status_n_e').attr('checked',true);
                    }
                    //设置form的action地址
                    $('#editForm').attr('action','/marketinginfo/marketingactive/'+data._id+'/edit');  //设置form表单的action地址
                    $('#editModal').modal('show');
                },
                error:function(xhr,textStatus){
                    console.log(xhr+textStatus);
                }
            })
        }
    });


    //删除
    $('#delete').click(function(){
        var selList=getChecked();
        if(selList.length==0){
            alert('请选择要删除的选项！');
        }else{
            //console.log(JSON.stringify(selList));
            var selJson=JSON.stringify(selList);

            var iframeSrc=$('iframe',parent.document).attr('src');//得到父窗口iframe的src地址传给ajax的url
            console.log('iframeSrc:',iframeSrc);
            $.ajax({
                url:'/'+iframeSrc+'/remove',
                type:'POST',
                async:true,
                data:{"_ids":selJson},  //转换为JSON格式传输
                dataType:'json',
                success:function(data){
                    //console.log(data);
                    window.location.reload();
                },
                error:function(xhr,textStatus){
                    console.log(xhr+textStatus);
                }
            });
        }
    })
});
//获取选择项
function getChecked(){
    var selArr=[];
    $('input[name=td_sel]:checked').each(function(){
        selArr.push($(this).val());
    });
    //console.log('selArr',selArr);
    return selArr;  //返回的是数组
}