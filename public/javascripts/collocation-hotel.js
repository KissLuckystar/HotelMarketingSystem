/**
 * Created by smk on 2017/4/18.
 * 配置管理-酒店管理
 */
$(function(){
    //hotel DataGrid数据表格
    $('#hotel').datagrid({
        url : '/collocation/hotel/data',
        fit : true,
        fitColumns : true,
        striped : true,
        rownumbers : true,
        border : false,
        pagination : true,
        pageSize : 10,
        pageList : [10, 20, 30, 40, 50],
        pageNumber : 1,
        sortName : 'date',
        sortOrder : 'desc',
        toolbar : '#hotel_tool',
        columns : [[
            {
                field : '_id',
                title : '编号',
                width : 100,
                checkbox : true,
            },
            {
                field : 'hotel_name',
                title : '酒店名称',
                width : 100,
            },
            {
                field : 'hotel_address',
                title : '酒店地址',
                width : 100,
            },
            {
                field : 'phone',
                title : '酒店电话',
                width : 100,
            },
            {
                field : 'note',
                title : '备注',
                width : 100,
            },
        ]],
        onLoadSuccess : function(data) {
            if(data.total == 0) {
                $.messager.alert('系统提示','未查找到相关记录','info');
            }
        }
    });
    //新增酒店弹窗
    $('#hotel_add').dialog({
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
                    if ($('#hotel_add').form('validate')) {
                        $.ajax({
                            url: '/collocation/hotel/add',
                            type: 'POST',
                            data: {
                                hotel_name: $.trim($('input[name="hotel_name"]').val()),
                                hotel_address: $.trim($('input[name="hotel_address"]').val()),
                                phone: $.trim($('input[name="phone"]').val()),
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
                                        msg: '新增酒店信息成功！',
                                    });
                                    $('#hotel_add').dialog('close').form('reset');
                                    $('#hotel').datagrid('reload');
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
                    $('#hotel_add').dialog('close').form('reset');
                },
            }
        ]
    });
    //酒店管理输入框验证
    $('input[name="hotel_name"]').validatebox({
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入酒店名称',
        invalidMessage : '酒店名称在2-20 位',
    });
    $('input[name="hotel_address"],input[name="hotel_address_edit"]').validatebox({
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入酒店地址',
        invalidMessage : '酒店地址在2-20 位',
    });
    $('input[name="phone"],input[name="phone_edit"]').validatebox({
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入酒店电话',
        invalidMessage : '酒店电话在2-20 位',
    });
    //工具方法
    hotel_tool = {
        //新增
        add : function () {
            $('#hotel_add').dialog('open');
            $('input[name="hotel_name"]').focus();
        },
        //编辑
        edit : function () {
            var rows = $('#hotel').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/collocation/hotel/edit',
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
                            $('#hotel_edit').form('load', {
                                id : data._id,
                                hotel_name_edit : data.hotel_name,
                                hotel_address_edit : data.hotel_address,
                                phone_edit : data.phone,
                                note_edit : data.note,
                            }).dialog('open');
                        }
                    },
                });
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 编辑记录至少选定一条数据！', 'warning');
            }
        },
        //删除
        remove : function () {
            var rows = $('#hotel').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/collocation/hotel/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#hotel').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#hotel').datagrid('loaded');
                                    $('#hotel').datagrid('reload');
                                    $('#hotel').datagrid('unselectAll');
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
            $('#hotel').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#hotel').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#hotel').datagrid('load',{
                search_hotel : $.trim($('input[name="search_hotel"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#hotel_search').form('reset');
        }
    };
    //修改酒店弹窗
    $('#hotel_edit').dialog({
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
                    if ($('#hotel_edit').form('validate')) {
                        $.ajax({
                            url: '/collocation/hotel/update',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                hotel_name: $.trim($('input[name="hotel_name_edit"]').val()),
                                hotel_address: $.trim($('input[name="hotel_address_edit"]').val()),
                                phone: $.trim($('input[name="phone_edit"]').val()),
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
                                        msg: '修改酒店信息成功！',
                                    });
                                    $('#hotel_edit').dialog('close').form('reset');
                                    $('#hotel').datagrid('reload');
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
                    $('#hotel_edit').dialog('close').form('reset');
                },
            }
        ]
    });
});
