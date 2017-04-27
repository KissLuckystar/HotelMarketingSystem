/**
 * Created by smk on 2017/4/26.
 * 电子预售券定制、审核
 */
$(function() {
    //hotel DataGrid数据表格
    $('#productf').datagrid({
        url: '/product/customization/data',
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
        toolbar: '#productf_tool',
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
    //新增营销活动弹窗，上传
    $('#productf_add').dialog({
        width : 350,
        title : '新增管理',
        iconCls : 'icon-add',
        modal : true,
        closed : true,
        buttons : [
            {
                text: '提交',
                iconCls: 'icon-add',
                handler: function () {
                    if ($('#productf_add').form('validate')) {
                        $.ajax({
                            url: '/product/customization/add',
                            type: 'POST',
                            data: {
                                name: $.trim($('input[name="name"]').val()),
                                annual_rate: $.trim($('input[name="annual_rate"]').val()),
                                total_amount: $.trim($('input[name="total_amount"]').val()),
                                min_amount: $.trim($('input[name="min_amount"]').val()),
                                max_amount: $.trim($('input[name="max_amount"]').val()),
                                start_sell: $('input[name="start_sell"]').val(),
                                end_sell: $('input[name="end_sell"]').val(),
                                start_interest: $('input[name="start_interest"]').val(),
                                end_interest: $('input[name="end_interest"]').val(),
                                audit_state: $('input[name="audit_state"]').val(),
                                protocol_id: $('input[name="protocol_id"]').val(),
                                note: $.trim($('input[name="note"]').val()),
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
                                        msg: '新增电子预售券信息成功！',
                                    });
                                    $('#productf_add').dialog('close').form('reset');
                                    $('#productf').datagrid('reload');
                                } else {
                                    $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                                }
                            }
                        });
                    }
                },
            },
            {
                text : '取消',
                iconCls : 'icon-redo',
                handler : function () {
                    $('#productf_add').dialog('close').form('reset');
                }
            }
        ]
    });
    //修改营销活动信息弹窗，上传
    $('#productf_edit').dialog({
        width : 350,
        title : '修改管理',
        iconCls : 'icon-add',
        modal : true,
        closed : true,
        buttons : [
            {
                text : '提交',
                iconCls : 'icon-edit',
                handler : function () {
                    if ($('#productf_edit').form('validate')) {
                        $.ajax({
                            url: '/product/customization/update',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                name: $.trim($('input[name="name_edit"]').val()),
                                annual_rate: $.trim($('input[name="annual_rate_edit"]').val()),
                                total_amount: $.trim($('input[name="total_amount_edit"]').val()),
                                min_amount: $.trim($('input[name="min_amount_edit"]').val()),
                                max_amount: $.trim($('input[name="max_amount_edit"]').val()),
                                start_sell: $('input[name="start_sell_edit"]').val(),
                                end_sell: $('input[name="end_sell_edit"]').val(),
                                start_interest: $('input[name="start_interest_edit"]').val(),
                                end_interest: $('input[name="end_interest_edit"]').val(),
                                audit_state: $('input[name="audit_state_edit"]').val(),
                                protocol_id: $('input[name="protocol_id_edit"]').val(),
                                note: $.trim($('input[name="note_edit"]').val()),
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
                                        msg: '修改电子预售券信息成功！',
                                    });
                                    $('#productf_edit').dialog('close').form('reset');
                                    $('#productf').datagrid('reload');
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
                    $('#productf_edit').dialog('close').form('reset');
                },
            }
        ]
    });
    //页面按钮

    $('#audit_state,#audit_state_edit').combobox({
        data : [{
            "id" : 1,
            "text" : "未提交",
            "selected" : "true"
        },{
            "id" : 2,
            "text" : "审核中",
        },{
            "id" : 3,
            "text" : "未通过",
        }],
        valueField : 'text',
        textField : 'text'
    });
    $('#start_sell,#end_sell,#start_interest,#end_interest').datetimebox({
        required : true,
        showSeconds : true
    });
    $('#start_sell_edit,#end_sell_edit,#start_interest_edit,#end_interest_edit').datetimebox({
        required : true,
        showSeconds : true
    });
    //工具方法
    productf_tool = {
        //新增
        add : function () {
            $.ajax({
                url: '/common/protocol/all',
                type: 'GET',
                beforeSend: function () {
                    $.messager.progress({
                        text: '加载中...',
                    });
                },
                success: function (data) {
                    $.messager.progress('close');
                    //data为对象数组，combobox要求的为数组，需要转化处理
                    var dataArr=[];
                    for(var i=0;i<data.length;i++){
                        if(i==0){
                            var obj={
                                "_id" : data[i]._id,
                                "name" : data[i].name,
                                "selected" : "true"
                            };
                        } else{
                            var obj={
                                "_id" : data[i]._id,
                                "name" : data[i].name
                            };
                        }
                        dataArr.push(obj);
                    }
                    $('input[name="protocol_id"]').combobox({
                        data : dataArr,
                        valueField : '_id',
                        textField : 'name',
                    });
                    $('#productf_add').dialog('open');
                    $('input[name="name"]').focus();
                }
            });
        },
        //编辑
        edit : function () {
            var rows = $('#productf').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/product/customization/edit',
                    data : {
                        id : rows[0]._id,
                    },
                    beforeSend : function () {
                        $.messager.progress({
                            text : '正在尝试获取数据...',
                        });
                    },
                    success : function (data) {
                        $.ajax({
                            url: '/common/protocol/all',
                            type: 'GET',
                            success: function (data, response, status) {
                                //data为对象数组，combobox要求的为数组，需要转化处理
                                var dataArr=[];
                                for(var i=0;i<data.length;i++){
                                    var obj={
                                        "_id" : data[i]._id,
                                        "name" : data[i].name,
                                    };
                                    dataArr.push(obj);
                                }
                                $('input[name="protocol_id_edit"]').combobox({
                                    data : dataArr,
                                    valueField : '_id',
                                    textField : 'name'
                                });
                            }
                        });
                        $.messager.progress('close');
                        if (data) {
                            $('#productf_edit').form('load', {
                                id : data._id,
                                name_edit : data.name,
                                user_id_edit : data.user_id.name,
                                annual_rate_edit : data.annual_rate,
                                total_amount_edit : data.total_amount,
                                min_amount_edit : data.min_amount,
                                max_amount_edit : data.max_amount,
                                start_sell_edit : timeFormat(data.start_sell).minute,
                                end_sell_edit : timeFormat(data.end_sell).minute,
                                start_interest_edit : timeFormat(data.start_interest).minute,
                                end_interest_edit : timeFormat(data.end_interest).minute,
                                audit_state_edit : data.audit_state,
                                protocol_id_edit : data.protocol_id.name,
                                note_edit : data.note
                            }).dialog('open');
                        }
                    }
                });
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 编辑记录至少选定一条数据！', 'warning');
            }
        },
        //删除
        remove : function () {
            var rows = $('#productf').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/product/customization/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#productf').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#productf').datagrid('loaded');
                                    $('#productf').datagrid('reload');
                                    $('#productf').datagrid('unselectAll');
                                    $.messager.show({
                                        title : '提示',
                                        msg : data.affected_rows + '条记录被删除成功！',
                                    });
                                }
                            },
                        });
                    }
                });
            } else {
                $.messager.alert(' 警告操作', ' 删除记录至少选定一条数据！ ', 'warning');
            }
        },
        //提交审核
        verify : function () {
            var rows = $('#productf').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 提交审核记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                if(rows[0].state=="审核中" || rows[0].state=="未通过"){
                    $.messager.alert(' 警告操作', ' 该条记录' + rows[0].state + '！', 'warning');
                } else {
                    $.ajax({
                        type : 'POST',
                        url : '/product/customization/verify',
                        data : {
                            id : rows[0]._id,
                        },
                        beforeSend : function () {
                            $('#productf').datagrid('loading');
                        },
                        success : function (data) {
                            if (data.state > 0) {
                                $('#productf').datagrid('loaded');
                                $('#productf').datagrid('reload');
                                $.messager.show({
                                    title: '提示',
                                    msg: '电子预售券信息提交审核成功！',
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
            $('#productf').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#productf').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#productf').datagrid('load',{
                search_productf : $.trim($('input[name="search_productf"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#productf_search').form('reset');
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