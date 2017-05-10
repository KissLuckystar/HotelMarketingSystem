/**
 * Created by smk on 2017/4/27.
 * app用户管理
 */
$(function(){
    $('#appuser').datagrid({
        url: '/accountbill/appuser/data',
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
        toolbar: '#appuser_tool',
        columns: [[
            {
                field: '_id',
                title: '编号',
                width: 100,
                checkbox: true,
            },
            {
                field: 'account',
                title: '账号',
                width: 50,
            },
            {
                field: 'name',
                title: '姓名',
                width: 100,
            },
            {
                field: 'password',
                title: '密码',
                width: 100,
            },
            {
                field: 'phone',
                title: '电话号码',
                width: 100,
            },
            {
                field: 'email',
                title: '邮箱',
                width: 100,
            },
            {
                field: 'account_money',
                title: '账户',
                width: 100,
            },
            {
                field: 'account_tmoney',
                title: '账户总资产(元)',
                width: 100
            },
            {
                field: 'account_lmoney',
                title: '账户余额(元)',
                width: 100
            },
            {
                field: 'pay_pass',
                title: '支付密码',
                width: 100
            },
            {
                field: 'state',
                title: '状态',
                width: 50,
            },
            {
                field: 'create_time',
                title: '创建时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.create_time).minute;
                }
            }
        ]],
        onLoadSuccess: function (data) {
            if (data.total == 0) {
                $.messager.alert('系统提示', '未查找到相关记录', 'info');
            }
        }
    });
    //新增班组弹窗
    //已知问题：使用reset命令重置表单后，combobox和timespinner不会显示，在页面布局中可看到默认参数值
    $('#appuser_add').dialog({
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
                    if ($('#appuser_add').form('validate')) {
                        $.ajax({
                            url: '/accountbill/appuser/add',
                            type: 'POST',
                            data: {
                                account: $.trim($('input[name="account"]').val()),
                                name: $.trim($('input[name="name"]').val()),
                                password: $.trim($('input[name="password"]').val()),
                                phone: $.trim($('input[name="phone"]').val()),
                                email: $.trim($('input[name="email"]').val()),
                                state: $.trim($('input[name="state"]').val()),
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
                                        msg: '新增APP用户信息成功！',
                                    });
                                    $('#appuser_add').dialog('close').form('reset');
                                    $('#appuser').datagrid('reload');
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
                    $('#appuser_add').dialog('close').form('reset');
                },
            }
        ]
    });
    //修改班组弹窗
    $('#appuser_edit').dialog({
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
                    if ($('#appuser_edit').form('validate')) {
                        $.ajax({
                            url: '/accountbill/appuser/update',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                name: $.trim($('input[name="name_edit"]').val()),
                                password: $.trim($('input[name="password_edit"]').val()),
                                phone: $.trim($('input[name="phone_edit"]').val()),
                                email: $.trim($('input[name="email_edit"]').val()),
                                state: $.trim($('input[name="state_edit"]').val()),
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
                                        msg: '修改APP用户信息成功！',
                                    });
                                    $('#appuser_edit').dialog('close').form('reset');
                                    $('#appuser').datagrid('reload');
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
                    $('#appuser_edit').dialog('close').form('reset');
                },
            }
        ]
    });
    $('#state,#state_edit').combobox({
        data : [{
            "id" : 1,
            "text" : "正常",
            "selected" : "true"
        },{
            "id" : 2,
            "text" : "冻结",
        }],
        valueField : 'text',
        textField : 'text'
    });
    //工具方法
    appuser_tool = {
        //新增
        add : function () {
            $('#appuser_add').dialog('open');
            $('input[name="account"]').focus();
        },
        //编辑
        edit : function () {
            var rows = $('#appuser').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/accountbill/appuser/edit',
                    data : {
                        id : rows[0]._id,
                    },
                    beforeSend : function () {
                        $.messager.progress({
                            text : '正在尝试获取数据...'
                        });
                    },
                    success : function (data) {
                        $.messager.progress('close');
                        if (data) {
                            $('#appuser_edit').form('load', {
                                id : data._id,
                                account_edit : data.account,
                                name_edit : data.name,
                                password_edit : data.password,
                                phone_edit : data.phone,
                                email_edit : data.email,
                                state_edit : data.state,
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
            var rows = $('#appuser').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/accountbill/appuser/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#appuser').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#appuser').datagrid('loaded');
                                    $('#appuser').datagrid('reload');
                                    $('#appuser').datagrid('unselectAll');
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
            $('#appuser').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#appuser').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#appuser').datagrid('load',{
                search_appuser : $.trim($('input[name="search_appuser"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#appuser_search').form('reset');
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
