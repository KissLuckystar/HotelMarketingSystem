/**
 * Created by smk on 2017/5/8.
 */
$(function() {
    $('#producti').datagrid({
        url: '/cashierdesk/recharge/data',
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
        toolbar: '#producti_tool',
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
            },
            {
                field: 'user_id',
                title: '发行人',
                width: 50,
                formatter: function(value,row,index){
                    return row.user_id.name;
                }
            },
            {
                field: 'annual_rate',
                title: '年化奖励率(%)',
                width: 100
            },
            {
                field: 'total_amount',
                title: '发行总额(元)',
                width: 100
            },
            {
                field: 'min_amount',
                title: '起购金额(元)',
                width: 100
            },
            {
                field: 'max_amount',
                title: '限购金额(元)',
                width: 100
            },
            {
                field: 'start_sell',
                title: '发售时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.start_sell).minute;
                }
            },
            {
                field: 'end_sell',
                title: '停售时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.end_sell).minute;
                }
            },
            {
                field: 'start_interest',
                title: '起息时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.start_interest).minute;
                }
            },
            {
                field: 'end_interest',
                title: '止息时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.end_interest).minute;
                }
            },
            {
                field: 'protocol_id',
                title: '服务协议',
                width: 50,
                formatter: function(value,row,index){
                    return row.protocol_id.name;
                }
            },
            {
                field: 'left_amount',
                title: '剩余金额',
                width: 100
            },
            {
                field: 'note',
                title: '备注',
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
    $('#producti_buy').dialog({
        width : 350,
        title : '购买充值电子预售券',
        iconCls : 'icon-add',
        modal : true,
        closed : true,
        buttons : [
            {
                text : '购买',
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
                                left_amount:$('input[name="left_amount"]').val()
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
    producti_tool = {
        //编辑
        buy : function () {
            var rows = $('#producti').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 购买只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/cashierdesk/recharge/info',
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
                            $('#producti_buy').form('load', {
                                id : data._id,
                                name : data.name,
                                left_amount:data.left_amount
                            }).dialog('open');
                        }
                    }
                });
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 购买至少选定一条数据！', 'warning');
            }
        },
        //取消所有选定
        redo : function () {
            $('#producti').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#producti').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#producti').datagrid('load',{
                search_producti : $.trim($('input[name="search_producti"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#producti_search').form('reset');
        }
    };
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