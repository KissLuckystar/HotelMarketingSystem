/**
 * Created by smk on 2017/4/23.
 * 配置管理-班组管理
 */
$(function(){
    $('#group').datagrid({
        url: '/collocation/group/data',
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
        toolbar: '#group_tool',
        columns: [[
            {
                field: '_id',
                title: '编号',
                width: 100,
                checkbox: true,
            },
            {
                field: 'name',
                title: '班组名称',
                width: 100,
            },
            {
                field: 'hotel_id',
                title: '所属酒店',
                width: 100,
                formatter: function(value,row,index){
                    return row.hotel_id.hotel_name;
                }
            },
            {
                field: 'begin_time',
                title: '开始时间',
                width: 100,
            },
            {
                field: 'end_time',
                title: '结束时间',
                width: 100,
            },
            {
                field: 'note',
                title: '备注',
                width: 100,
            },
        ]],
        onLoadSuccess: function (data) {
            if (data.total == 0) {
                $.messager.alert('系统提示', '未查找到相关记录', 'info');
            }
        }
    });
    //新增班组弹窗
    //已知问题：使用reset命令重置表单后，combobox和timespinner不会显示，在页面布局中可看到默认参数值
    $('#group_add').dialog({
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
                    if ($('#group_add').form('validate')) {
                        $.ajax({
                            url: '/collocation/group/add',
                            type: 'POST',
                            data: {
                                name: $.trim($('input[name="name"]').val()),
                                hotel_id: $('input[name="hotel_id"]').val(),
                                begin_time: $('input[name="begin_time"]').val(),
                                end_time: $('input[name="end_time"]').val(),
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
                                        msg: '新增班组信息成功！',
                                    });
                                    $('#group_add').dialog('close').form('reset');
                                    $('#group').datagrid('reload');
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
                    $('#group_add').dialog('close').form('reset');
                },
            }
        ]
    });
    //修改班组弹窗
    $('#group_edit').dialog({
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
                    if ($('#group_edit').form('validate')) {
                        $.ajax({
                            url: '/collocation/group/update',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                name: $.trim($('input[name="name_edit"]').val()),
                                hotel_id: $('input[name="hotel_id_edit"]').val(),
                                begin_time: $('input[name="begin_time_edit"]').val(),
                                end_time: $('input[name="end_time_edit"]').val(),
                                note: $.trim($('input[name="note_edit"]').val())
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
                                        msg: '修改班组信息成功！',
                                    });
                                    $('#group_edit').dialog('close').form('reset');
                                    $('#group').datagrid('reload');
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
                    $('#group_edit').dialog('close').form('reset');
                },
            }
        ]
    });
    $('input[name="begin_time"],input[name="end_time"]').timespinner({
        value : '08:00:00',
        required : true,
        showSeconds : true
    });
    $('input[name="begin_time_edit"],input[name="end_time_edit"]').timespinner({
        required : true,
        showSeconds : true
    });
    //工具方法
    group_tool = {
        //新增
        add : function () {
            $.ajax({
                url: '/collocation/hotel/all',
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
                                "hotel_name" : data[i].hotel_name,
                                "selected" : "true"
                            };
                        } else{
                            var obj={
                                "_id" : data[i]._id,
                                "hotel_name" : data[i].hotel_name,
                            };
                        }
                        dataArr.push(obj);
                    }
                    $('input[name="hotel_id"]').combobox({
                        data : dataArr,
                        valueField : '_id',
                        textField : 'hotel_name',
                    });
                    $('#group_add').dialog('open');
                    $('input[name="name"]').focus();
                }
            });
        },
        //编辑
        edit : function () {
            var rows = $('#group').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/collocation/group/edit',
                    data : {
                        id : rows[0]._id,
                    },
                    beforeSend : function () {
                        $.messager.progress({
                            text : '正在尝试获取数据...'
                        });
                    },
                    success : function (data) {
                        $.ajax({
                            url: '/collocation/hotel/all',
                            type: 'GET',
                            success: function (data, response, status) {
                                //data为对象数组，combobox要求的为数组，需要转化处理
                                var dataArr=[];
                                for(var i=0;i<data.length;i++){
                                    var obj={
                                        "_id" : data[i]._id,
                                        "hotel_name" : data[i].hotel_name,
                                    };
                                    dataArr.push(obj);
                                }
                                $('input[name="hotel_id_edit"]').combobox({
                                    data : dataArr,
                                    valueField : '_id',
                                    textField : 'hotel_name'
                                });
                            }
                        });
                        $.messager.progress('close');
                        if (data) {
                            $('#group_edit').form('load', {
                                id : data._id,
                                name_edit : data.name,
                                hotel_id_edit : data.hotel_id._id,   //设置combobox的value为_id，不能为hotel_name
                                begin_time_edit : data.begin_time,
                                end_time_edit : data.end_time,
                                note_edit : data.note,
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
            var rows = $('#group').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/collocation/group/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#group').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#group').datagrid('loaded');
                                    $('#group').datagrid('reload');
                                    $('#group').datagrid('unselectAll');
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
        //取消所有选定
        redo : function () {
            $('#group').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#group').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#group').datagrid('load',{
                search_group : $.trim($('input[name="search_group"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#group_search').form('reset');
        }
    };
});
