/**
 * Created by smk on 2017/5/8.
 */
/**
 * Created by smk on 2017/5/8.
 */
$(function(){
    $('#return').datagrid({
        url: '/cashierdesk/recharge/return/data',
        fit: true,
        fitColumns: true,
        striped: true,
        rownumbers: true,
        border: false,
        pagination: true,
        pageSize: 10,
        pageList: [10, 20, 30, 40, 50],
        pageNumber: 1,
        sortName: 'date',
        sortOrder: 'desc',
        toolbar: '#return_tool',
        columns: [[
            {
                field: '_id',
                title: '编号',
                width: 50,
                checkbox: true,
            },
            {
                field: 'name',
                title: '产品名称',
                width: 100,
                formatter: function(value,row,index){
                    return row.product_id.name;
                }
            },
            {
                field: 'account_money',
                title: '充值账户',
                width: 100,
                formatter: function(value,row,index){
                    return row.appuser_id.account_money;
                }
            },
            {
                field: 'recharge',
                title: '充值金额(元)',
                width: 100
            },
            {
                field: 'back',
                title: '赠送总额(元)',
                width: 50
            },
            {
                field: 'way',
                title: '充值方式',
                width: 100
            },
            {
                field: 'user_name',
                title: '操作人',
                width: 50,
                formatter: function(value,row,index){
                    return row.user_id.name;
                }
            },
            {
                field: 'create_time',
                title: '充值时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.create_time).minute;
                }
            },
            {
                field: 'state',
                title: '充值状态',
                width: 100
            }
        ]],
        onLoadSuccess: function (data) {
            if (data.total == 0) {
                $.messager.alert('系统提示', '未查找到相关记录', 'info');
            }
        },
        // view: detailview,
        // detailFormatter: function(rowIndex,rowData){
        //     return '<table><tr>'+
        //         '<td rowspan=2 style="border:0"><img src="uploadFiles/'+rowData.file+'" style="height:50px;"></td>'+
        //         '<td valign="top" style="border:0;padding-left:10px;">'+
        //         '<p style="padding:0;margin:0;">活动内容：'+rowData.content+'</p>'+
        //         '</td>'+
        //         '</tr></table>';
        // }
    });
    //购买电子预售券弹窗
    $('#return_back').dialog({
        width : 350,
        title : '误收退还',
        iconCls : 'icon-add',
        modal : true,
        closed : true,
        buttons : [
            {
                text : '退还',
                iconCls : 'icon-add',
                handler : function () {
                    if ($('#producti_buy').form('validate')) {
                        $.ajax({
                            url: '/cashierdesk/recharge/buy',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                appuser_id: $.trim($('input[name="appuser_id"]').val()),
                                recharge: $.trim($('input[name="recharge"]').val()),
                                back: $.trim($('input[name="back"]').val()),
                                way: $.trim($('input[name="way"]').val()),
                            },
                            beforeSend: function () {
                                $.messager.progress({
                                    text: '正在尝试提交...',
                                });
                            },
                            success: function (data, response, status) {
                                $.messager.progress('close');
                                if (data.state > 0) {
                                    $.messager.show({
                                        title: '提示',
                                        msg: '购买电子预售券成功！',
                                    });
                                    $('#producti_buy').dialog('close').form('reset');
                                    $('#producti').datagrid('reload');
                                } else {
                                    $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                                }
                            }
                        });
                    }
                }
            },
            {
                text : '取消',
                iconCls : 'icon-redo',
                handler : function () {
                    $('#producti_buy').dialog('close').form('reset');
                },
            }
        ]
    });

    //工具方法
    return_tool = {
        //编辑
        back : function () {
            var rows = $('#return').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 购买只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/cashierdesk/return/info',
                    data : {
                        id : rows[0]._id,
                    },
                    beforeSend : function () {
                        $.messager.progress({
                            text : '正在尝试获取数据...',
                        });
                    },
                    success : function (data) {
                        $.messager.progress('close');
                        if (data) {
                            $('#return_back').form('load', {
                                id : data._id,
                                name : data.name,
                            }).dialog('open');
                        }
                    }
                });
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 购买至少选定一条数据！', 'warning');
            }
        },
        //当前页面刷新
        reload : function () {
            $('#return').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#return').datagrid('load',{
                search_return : $.trim($('input[name="search_return"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#return_search').form('reset');
        }
    }
});
function timeFormat(timeStr) {
    var date=timeStr?new Date(timeStr):new Date();
    var time={
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear()+'-'+(date.getMonth()+1),
        day:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
        minute:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+
        (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes())
    };
    return time;
}