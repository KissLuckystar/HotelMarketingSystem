/**
 * Created by smk on 2017/4/25.
 * 设备管理
 */
$(function(){
    $('#device').datagrid({
        url: '/collocation/device/data',
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
        toolbar: '#device_tool',
        columns: [[
            {
                field: '_id',
                title: '编号',
                width: 100,
                checkbox: true,
            },
            {
                field: 'name',
                title: '设备编号',
                width: 100,
            },
            {
                field: 'mac',
                title: 'MAC地址',
                width: 100,
            },
            {
                field: 'hotel_account',
                title: '银行账户',
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
                field: 'state',
                title: '设备状态',
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
    //新增设备弹窗
    //已知问题：使用reset命令重置表单后，combobox和timespinner不会显示，在页面布局中可看到默认参数值
    $('#device_add').dialog({
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
                    if ($('#device_add').form('validate')) {
                        $.ajax({
                            url: '/collocation/device/add',
                            type: 'POST',
                            data: {
                                name: $.trim($('input[name="name"]').val()),
                                mac: $.trim($('input[name="mac"]').val()),
                                hotel_account: $.trim($('input[name="hotel_account"]').val()),
                                hotel_id: $('input[name="hotel_id"]').val(),
                                state: $.trim($('input[name="state"]').val()),
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
                                        msg: '新增设备信息成功！',
                                    });
                                    $('#device_add').dialog('close').form('reset');
                                    $('#device').datagrid('reload');
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
                    $('#device_add').dialog('close').form('reset');
                },
            }
        ]
    });
    //修改班组弹窗
    $('#device_edit').dialog({
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
                    if ($('#device_edit').form('validate')) {
                        $.ajax({
                            url: '/collocation/device/update',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                name: $.trim($('input[name="name_edit"]').val()),
                                mac: $.trim($('input[name="mac_edit"]').val()),
                                hotel_account: $.trim($('input[name="hotel_account_edit"]').val()),
                                hotel_id: $('input[name="hotel_id_edit"]').val(),
                                state: $.trim($('input[name="state_edit"]').val()),
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
                                        msg: '修改设备信息成功！',
                                    });
                                    $('#device_edit').dialog('close').form('reset');
                                    $('#device').datagrid('reload');
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
                    $('#device_edit').dialog('close').form('reset');
                },
            }
        ]
    });
    $('#state,#state_edit').combobox({
        data : [{
            "id" : 1,
            "text" : "启用",
            "selected" : "true"
        },{
            "id" : 2,
            "text" : "停用",
        }],
        valueField : 'text',
        textField : 'text'
    });
    //工具方法
    device_tool = {
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
                    $('#device_add').dialog('open');
                    $('input[name="name"]').focus();
                }
            });
        },
        //编辑
        edit : function () {
            var rows = $('#device').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/collocation/device/edit',
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
                            $('#device_edit').form('load', {
                                id : data._id,
                                name_edit : data.name,
                                mac_edit : data.mac,
                                hotel_account_edit : data.hotel_account,
                                hotel_id_edit : data.hotel_id._id,   //设置combobox的value为_id，不能为hotel_name
                                state_edit : data.state,
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
            var rows = $('#device').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/collocation/device/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#device').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#device').datagrid('loaded');
                                    $('#device').datagrid('reload');
                                    $('#device').datagrid('unselectAll');
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
            $('#device').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#device').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#device').datagrid('load',{
                search_device : $.trim($('input[name="search_device"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#device_search').form('reset');
        }
    };
});
