/**
 * Created by smk on 2017/4/26.
 * 电子预售券审核
 */
$(function() {
    //hotel DataGrid数据表格
    $('#products').datagrid({
        url: '/product/verify/data',
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
        toolbar: '#products_tool',
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
                field: 'audit_state',
                title: '审计状态',
                width: 50
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
                field: 'create_time',
                title: '创建时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.create_time).minute;
                }
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

    //工具方法
    products_tool = {
        //审核通过
        pass : function () {
            var rows = $('#products').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 提交审核记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                if(rows[0].state=="未通过"){
                    $.messager.alert(' 警告操作', ' 该条记录' + rows[0].state + '！', 'warning');
                } else {
                    $.ajax({
                        type : 'POST',
                        url : '/product/verify/pass',
                        data : {
                            id : rows[0]._id,
                        },
                        beforeSend : function () {
                            $('#products').datagrid('loading');
                        },
                        success : function (data) {
                            if (data.state > 0) {
                                $('#products').datagrid('loaded');
                                $('#products').datagrid('reload');
                                $.messager.show({
                                    title: '提示',
                                    msg: '电子预售券信息审核通过！',
                                });
                            } else {
                                $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                            }
                        }
                    });
                }
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 提交审核记录至少选定一条数据！', 'warning');
            }
        },
        //审核通过
        notpass : function () {
            var rows = $('#products').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 提交审核记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                if(rows[0].state=="通过"){
                    $.messager.alert(' 警告操作', ' 该条记录' + rows[0].state + '！', 'warning');
                } else {
                    $.ajax({
                        type : 'POST',
                        url : '/product/verify/notpass',
                        data : {
                            id : rows[0]._id,
                        },
                        beforeSend : function () {
                            $('#products').datagrid('loading');
                        },
                        success : function (data) {
                            if (data.state > 0) {
                                $('#products').datagrid('loaded');
                                $('#products').datagrid('reload');
                                $.messager.show({
                                    title: '提示',
                                    msg: '电子预售券审核不通过！',
                                });
                            } else {
                                $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                            }
                        }
                    });
                }
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 提交审核记录至少选定一条数据！', 'warning');
            }
        },
        //取消所有选定
        redo : function () {
            $('#products').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#products').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#products').datagrid('load',{
                search_products : $.trim($('input[name="search_products"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#products_search').form('reset');
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
