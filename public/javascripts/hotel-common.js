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
    //编辑
    $('#edit').click(function(){
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