/**
 * Created by smk on 2017/4/25.
 * 协议管理
 */
$(function(){
    $('#protocol').datagrid({
        url: '/collocation/protocol/data',
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
        toolbar: '#protocol_tool',
        columns: [[
            {
                field: '_id',
                title: '编号',
                width: 100,
                checkbox: true,
            },
            {
                field: 'name',
                title: '协议标题',
                width: 100,
            },
            {
                field: 'content',
                title: '协议内容',
                width: 100,
                formatter: function(value,row,index){
                    return sliceText(row.content,50);
                }
            },
            {
                field: 'user_id',
                title: '创建人',
                width: 50,
                formatter: function(value,row,index){
                    return row.user_id.name;
                }
            },
            {
                field: 'create_time',
                title: '创建时间',
                width: 50,
                formatter: function(value,row,index){
                    return timeFormat(row.create_time).minute;
                }
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
    $('#protocol_add').dialog({
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
                    if ($('#protocol_add').form('validate')) {
                        $.ajax({
                            url: '/collocation/protocol/add',
                            type: 'POST',
                            data: {
                                name: $.trim($('input[name="name"]').val()),
                                content: $.trim($('input[name="content"]').val()),
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
                                        msg: '新增协议信息成功！',
                                    });
                                    $('#protocol_add').dialog('close').form('reset');
                                    $('#protocol').datagrid('reload');
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
                    $('#protocol_add').dialog('close').form('reset');
                },
            }
        ]
    });
    //修改协议弹窗
    $('#protocol_edit').dialog({
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
                    if ($('#protocol_edit').form('validate')) {
                        $.ajax({
                            url: '/collocation/protocol/update',
                            type: 'POST',
                            data: {
                                id:$('input[name="id"]').val(),
                                name: $.trim($('input[name="name_edit"]').val()),
                                content: $.trim($('input[name="content_edit"]').val()),
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
                                        msg: '修改协议信息成功！',
                                    });
                                    $('#protocol_edit').dialog('close').form('reset');
                                    $('#protocol').datagrid('reload');
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
                    $('#protocol_edit').dialog('close').form('reset');
                },
            }
        ]
    });
    //工具方法
    protocol_tool = {
        //新增
        add : function () {
            $('#protocol_add').dialog('open');
            $('input[name="name"]').focus();
        },
        //编辑
        edit : function () {
            var rows = $('#protocol').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/collocation/protocol/edit',
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
                            $('#protocol_edit').form('load', {
                                id : data._id,
                                name_edit : data.name,
                                content_edit : data.content,
                                user_id_edit : data.user_id.name,   //设置combobox的value为_id，不能为hotel_name
                                create_time_edit : timeFormat(data.create_time).minute,
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
            var rows = $('#protocol').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/collocation/protocol/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#protocol').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#protocol').datagrid('loaded');
                                    $('#protocol').datagrid('reload');
                                    $('#protocol').datagrid('unselectAll');
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
            $('#protocol').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#protocol').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#protocol').datagrid('load',{
                search_protocol : $.trim($('input[name="search_protocol"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#protocol_search').form('reset');
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

