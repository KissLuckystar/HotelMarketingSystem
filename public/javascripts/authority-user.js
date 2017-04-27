/**
 * Created by smk on 2017/4/25.
 * 用户管理
 */
$(function(){
    $('#user').datagrid({
        url: '/authority/user/data',
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
        toolbar: '#user_tool',
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
                field: 'sex',
                title: '性别',
                width: 50,
            },
            {
                field: 'birth',
                title: '出生日期',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.birth).day;
                }
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
                field: 'identity',
                title: '用户身份',
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
                field: 'group_id',
                title: '所属班组',
                width: 100,
                formatter: function(value,row,index){
                    return row.group_id.name;
                }
            },
            {
                field: 'usergroup_id',
                title: '所属用户组',
                width: 100,
                formatter: function(value,row,index){
                    return row.usergroup_id.name;
                }
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
    $('#user_add').dialog({
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
                    if ($('#user_add').form('validate')) {
                        $.ajax({
                            url: '/authority/user/add',
                            type: 'POST',
                            data: {
                                account: $.trim($('input[name="account"]').val()),
                                name: $.trim($('input[name="name"]').val()),
                                password: $.trim($('input[name="password"]').val()),
                                sex: $('input[name="sex"]').val(),
                                birth: $.trim($('input[name="birth"]').val()),
                                phone: $.trim($('input[name="phone"]').val()),
                                email: $.trim($('input[name="email"]').val()),
                                identity: $.trim($('input[name="identity"]').val()),
                                hotel_id: $('input[name="hotel_id"]').val(),
                                group_id: $('input[name="group_id"]').val(),
                                usergroup_id: $('input[name="usergroup_id"]').val(),
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
                                        msg: '新增系统用户信息成功！',
                                    });
                                    $('#user_add').dialog('close').form('reset');
                                    $('#user').datagrid('reload');
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
                    $('#user_add').dialog('close').form('reset');
                },
            }
        ]
    });
    //修改班组弹窗
    $('#user_edit').dialog({
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
                    if ($('#user_edit').form('validate')) {
                        $.ajax({
                            url: '/authority/user/update',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                name: $.trim($('input[name="name_edit"]').val()),
                                password: $.trim($('input[name="password_edit"]').val()),
                                sex: $('input[name="sex_edit"]').val(),
                                birth: $.trim($('input[name="birth_edit"]').val()),
                                phone: $.trim($('input[name="phone_edit"]').val()),
                                email: $.trim($('input[name="email_edit"]').val()),
                                identity: $.trim($('input[name="identity_edit"]').val()),
                                hotel_id: $('input[name="hotel_id_edit"]').val(),
                                group_id: $('input[name="group_id_edit"]').val(),
                                usergroup_id: $('input[name="usergroup_id_edit"]').val(),
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
                                        msg: '修改系统用户信息成功！',
                                    });
                                    $('#user_edit').dialog('close').form('reset');
                                    $('#user').datagrid('reload');
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
                    $('#user_edit').dialog('close').form('reset');
                },
            }
        ]
    });
    $('#sex,#sex_edit').combobox({
        data : [{
            "id" : 1,
            "text" : "男",
            "selected" : "true"
        },{
            "id" : 2,
            "text" : "女",
        }],
        valueField : 'text',
        textField : 'text'
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
    $('#birth,#birth_edit').datebox({
        required : true
    });
    //工具方法
    user_tool = {
        //新增
        add : function () {
            $.ajax({
                url: '/common/user/combobox',
                type: 'GET',
                beforeSend: function () {
                    $.messager.progress({
                        text: '加载中...',
                    });
                },
                success: function (data) {
                    $.messager.progress('close');
                    var hotelArr=[], groupArr=[], usergroupArr=[];
                    var obj={};
                    $.each(data.hotels,function(index,value){
                        if(index==0){
                            obj={
                                "_id" : value._id,
                                "hotel_name" : value.hotel_name,
                                "selected" : "true"
                            };
                        } else{
                            obj={
                                "_id" : value._id,
                                "hotel_name" : value.hotel_name,
                            };
                        }
                        hotelArr.push(obj);
                    });
                    $.each(data.groups,function(index,value){
                        if(index==0){
                            obj={
                                "_id" : value._id,
                                "name" : value.name,
                                "selected" : "true"
                            };
                        } else{
                            obj={
                                "_id" : value._id,
                                "name" : value.name,
                            };
                        }
                        groupArr.push(obj);
                    });
                    $.each(data.usergroups,function(index,value){
                        if(index==0){
                            obj={
                                "_id" : value._id,
                                "name" : value.name,
                                "selected" : "true"
                            };
                        } else{
                            obj={
                                "_id" : value._id,
                                "name" : value.name,
                            };
                        }
                        usergroupArr.push(obj);
                    });

                    $('input[name="hotel_id"]').combobox({
                        data : hotelArr,
                        valueField : '_id',
                        textField : 'hotel_name',
                    });
                    $('input[name="group_id"]').combobox({
                        data : groupArr,
                        valueField : '_id',
                        textField : 'name',
                    });
                    $('input[name="usergroup_id"]').combobox({
                        data : usergroupArr,
                        valueField : '_id',
                        textField : 'name',
                    });
                    $('#user_add').dialog('open');
                    $('input[name="account"]').focus();
                }
            });
        },
        //编辑
        edit : function () {
            var rows = $('#user').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/authority/user/edit',
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
                            url: '/common/user/combobox',
                            type: 'GET',
                            success: function (data, response, status) {
                                var hotelArr=[], groupArr=[], usergroupArr=[];
                                var obj={};
                                $.each(data.hotels,function(index,value){
                                    if(index==0){
                                        obj={
                                            "_id" : value._id,
                                            "hotel_name" : value.hotel_name,
                                            "selected" : "true"
                                        };
                                    } else{
                                        obj={
                                            "_id" : value._id,
                                            "hotel_name" : value.hotel_name,
                                        };
                                    }
                                    hotelArr.push(obj);
                                });
                                $.each(data.groups,function(index,value){
                                    if(index==0){
                                        obj={
                                            "_id" : value._id,
                                            "name" : value.name,
                                            "selected" : "true"
                                        };
                                    } else{
                                        obj={
                                            "_id" : value._id,
                                            "name" : value.name,
                                        };
                                    }
                                    groupArr.push(obj);
                                });
                                $.each(data.usergroups,function(index,value){
                                    if(index==0){
                                        obj={
                                            "_id" : value._id,
                                            "name" : value.name,
                                            "selected" : "true"
                                        };
                                    } else{
                                        obj={
                                            "_id" : value._id,
                                            "name" : value.name,
                                        };
                                    }
                                    usergroupArr.push(obj);
                                });

                                $('input[name="hotel_id_edit"]').combobox({
                                    data : hotelArr,
                                    valueField : '_id',
                                    textField : 'hotel_name',
                                });
                                $('input[name="group_id_edit"]').combobox({
                                    data : groupArr,
                                    valueField : '_id',
                                    textField : 'name',
                                });
                                $('input[name="usergroup_id_edit"]').combobox({
                                    data : usergroupArr,
                                    valueField : '_id',
                                    textField : 'name',
                                });
                            }
                        });
                        $.messager.progress('close');
                        if (data) {
                            $('#user_edit').form('load', {
                                id : data._id,
                                account_edit : data.account,
                                name_edit : data.name,
                                password_edit : data.password,
                                sex_edit : data.sex,
                                birth_edit : timeFormat(data.birth).day,
                                phone_edit : data.phone,
                                email_edit : data.email,
                                identity_edit : data.identity,
                                hotel_id_edit : data.hotel_id._id,   //设置combobox的value为_id，不能为hotel_name
                                group_id_edit : data.group_id._id,
                                usergroup_id_edit : data.usergroup_id._id,
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
            var rows = $('#user').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/authority/user/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#user').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#user').datagrid('loaded');
                                    $('#user').datagrid('reload');
                                    $('#user').datagrid('unselectAll');
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
            $('#user').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#user').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#user').datagrid('load',{
                search_user : $.trim($('input[name="search_user"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#user_search').form('reset');
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