/**
 * Created by smk on 2017/4/24.
 * 用户组管理
 */
/**
 * Created by smk on 2017/4/23.
 * 配置管理-班组管理
 */
$(function(){
    $('#usergroup').datagrid({
        url: '/authority/usergroup/data',
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
        toolbar: '#usergroup_tool',
        columns: [[
            {
                field: '_id',
                title: '编号',
                width: 100,
                checkbox: true,
            },
            {
                field: 'name',
                title: '用户组名称',
                width: 30,
            },
            {
                field: 'hotel_id',
                title: '所属酒店',
                width: 30,
                formatter: function(value,row,index){
                    return row.hotel_id.hotel_name;
                }
            },
            {
                field: 'authority',
                title: '用户组权限',
                width: 150,
                formatter: function(value,row,index){
                    return sliceText(row.authority,50);
                }
            },
            {
                field: 'create_time',
                title: '创建时间',
                width: 30,
                formatter: function(value,row,index){
                    return timeFormat(row.create_time).minute;
                }
            },
            {
                field: 'note',
                title: '备注',
                width: 60,
            },
        ]],
        onLoadSuccess: function (data) {
            if (data.total == 0) {
                $.messager.alert('系统提示', '未查找到相关记录', 'info');
            }
        }
    });
    //新增用户组弹窗
    //已知问题：使用reset命令重置表单后，combobox和timespinner不会显示，在页面布局中可看到默认参数值
    $('#usergroup_add').dialog({
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
                    if ($('#usergroup_add').form('validate')) {
                        $.ajax({
                            url: '/authority/usergroup/add',
                            type: 'POST',
                            data: {
                                name: $.trim($('input[name="name"]').val()),
                                hotel_id: $('input[name="hotel_id"]').val(),
                                authority: $('#auth').combotree('getText'),
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
                                        msg: '新增用户组信息成功！',
                                    });
                                    $('#usergroup_add').dialog('close').form('reset');
                                    $('#usergroup').datagrid('reload');
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
                    $('#usergroup_add').dialog('close').form('reset');
                },
            }
        ]
    });
    //分配权限
    $('#auth').combotree({
        //url : 'nav.php',
        required : true,
        lines : true,
        multiple : true,   //支持多选
        checkbox : true,
        onlyLeafCheck : true,   //true代表只能选子节点
        //cascadeCheck : true,   //层叠选中
        data : [{
            "id":1,
            "text":"系统功能",
            "children":[{
                "id":11,
                "text":"配置管理",
                "state":"closed",
                "children":[{
                    "id":111,
                    "text":"酒店管理"
                },{
                    "id":112,
                    "text":"班组管理"
                },{
                    "id":113,
                    "text":"协议管理"
                },{
                    "id":114,
                    "text":"设备管理"
                }]
            },{
                "id":12,
                "text":"权限管理",
                "children":[{
                    "id":121,
                    "text":"用户组管理"
                },{
                    "id":122,
                    "text":"用户管理",
                }]
            },{
                "id":13,
                "text":"电子预售券管理",
                "state":"closed",
                "children":[{
                    "id":131,
                    "text":"电子预售券定制"
                },{
                    "id":132,
                    "text":"电子预售券审核"
                },{
                    "id":133,
                    "text":"电子预售券维护"
                }]
            },{
                "id":14,
                "text":"账户账单管理",
                "state":"closed",
                "children":[{
                    "id":141,
                    "text":"账户管理"
                },{
                    "id":142,
                    "text":"账单管理"
                }]
            },{
                "id":15,
                "text":"营销信息管理"
            },{
                "id":16,
                "text":"销售统计"
            },{
                "id":17,
                "text":"收银台",
                "state":"closed",
                "children":[{
                    "id":171,
                    "text":"后台充值"
                },{
                    "id":172,
                    "text":"误收退还"
                }]
            }]
        }],
        onLoadSuccess : function (node, data) {
            var _this = this;
            if (data) {
                $(data).each(function (index, value) {
                    if (this.state == 'closed') {
                        $(_this).tree('expandAll');
                    }
                });
            }
        },
    });
    //修改班组弹窗
    $('#usergroup_edit').dialog({
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
                    if ($('#usergroup_edit').form('validate')) {
                        $.ajax({
                            url: '/authority/usergroup/update',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                name: $.trim($('input[name="name_edit"]').val()),
                                hotel_id: $('input[name="hotel_id_edit"]').val(),
                                authority: $('#auth_edit').combotree('getText'),
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
                                        msg: '修改用户组信息成功！',
                                    });
                                    $('#usergroup_edit').dialog('close').form('reset');
                                    $('#usergroup').datagrid('reload');
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
                    $('#usergroup_edit').dialog('close').form('reset');
                },
            }
        ]
    });
    //工具方法
    usergroup_tool = {
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
                    $('#usergroup_add').dialog('open');
                    $('input[name="name"]').focus();
                }
            });
        },
        //编辑
        edit : function () {
            var rows = $('#usergroup').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/authority/usergroup/edit',
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
                            var usergroup = data;
                            $('#usergroup_edit').form('load', {
                                id : data._id,
                                name_edit : data.name,
                                hotel_id_edit : data.hotel_id._id,   //设置combobox的value为_id，不能为hotel_name
                                //auth_edit : data.authority,
                                create_time_edit : timeFormat(data.create_time).minute,
                                note_edit : data.note,
                            }).dialog('open');
                            //分配权限
                            $('#auth_edit').combotree({
                                //url : 'nav.php',
                                required : true,
                                lines : true,
                                multiple : true,   //支持多选
                                checkbox : true,
                                onlyLeafCheck : true,   //true代表只能选子节点
                                //cascadeCheck : true,   //层叠选中
                                data : [{
                                        "id":11,
                                        "text":"配置管理",
                                        "state":"closed",
                                        "children":[{
                                            "id":111,
                                            "text":"酒店管理"
                                        },{
                                            "id":112,
                                            "text":"班组管理"
                                        },{
                                            "id":113,
                                            "text":"协议管理"
                                        },{
                                            "id":114,
                                            "text":"设备管理"
                                        }]
                                    },{
                                        "id":12,
                                        "text":"权限管理",
                                        "children":[{
                                            "id":121,
                                            "text":"用户组管理"
                                        },{
                                            "id":122,
                                            "text":"用户管理",
                                        }]
                                    },{
                                        "id":13,
                                        "text":"电子预售券管理",
                                        "state":"closed",
                                        "children":[{
                                            "id":131,
                                            "text":"电子预售券定制"
                                        },{
                                            "id":132,
                                            "text":"电子预售券审核"
                                        },{
                                            "id":133,
                                            "text":"电子预售券维护"
                                        }]
                                    },{
                                        "id":14,
                                        "text":"账户账单管理",
                                        "state":"closed",
                                        "children":[{
                                            "id":141,
                                            "text":"账户管理"
                                        },{
                                            "id":142,
                                            "text":"账单管理"
                                        }]
                                    },{
                                        "id":15,
                                        "text":"营销信息管理"
                                    },{
                                        "id":16,
                                        "text":"销售统计"
                                    },{
                                        "id":17,
                                        "text":"收银台",
                                        "state":"closed",
                                        "children":[{
                                            "id":171,
                                            "text":"后台充值"
                                        },{
                                            "id":172,
                                            "text":"误收退还"
                                        }]
                                    }],
                                onLoadSuccess : function (node, data) {
                                    // var _this = this;
                                    // console.log(usergroup);
                                    // var auth=usergroup.authority.split(',');
                                    // console.log(auth);
                                    if (data) {
                                        // $(data).each(function (index, value) {
                                        //     console.log(value);
                                        //     if ($.inArray(value.text, auth) != -1) {
                                        //         $(_this).tree('check', value.target);
                                        //     }
                                        // });
                                        if (this.state == 'closed') {
                                            $(_this).tree('expandAll');
                                        }
                                    }
                                },
                            });
                        }
                    }
                });
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 编辑记录至少选定一条数据！', 'warning');
            }
        },
        //删除
        remove : function () {
            var rows = $('#usergroup').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/authority/usergroup/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#usergroup').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#usergroup').datagrid('loaded');
                                    $('#usergroup').datagrid('reload');
                                    $('#usergroup').datagrid('unselectAll');
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
            $('#usergroup').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#usergroup').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#usergroup').datagrid('load',{
                search_usergroup : $.trim($('input[name="search_usergroup"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#usergroup_search').form('reset');
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
//控制标题长度
function getLength(str) {
    //获得字符串实际长度，中文2，英文1
    //str要获得长度的字符串
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128){
            realLength += 1;
        } else{
            realLength += 2;
        }
    }
    return realLength;
}
/**
 * 如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。
 * @param str：需要截取的字符串
 * @param len: 需要截取的长度
 */
function sliceText(str, len) {
    var str_length = getLength(str);
    if(str_length<=len){
        return str;
    } else {
        return str.substring(0,len-1)+'...';
    }
}

