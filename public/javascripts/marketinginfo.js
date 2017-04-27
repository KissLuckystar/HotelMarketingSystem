/**
 * Created by smk on 2017/4/21.
 * 营销信息管理
 */
$(function() {
    //hotel DataGrid数据表格
    $('#activity').datagrid({
        url: '/marketinginfo/activity/data',
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
        toolbar: '#activity_tool',
        columns: [[
            {
                field: '_id',
                title: '编号',
                width: 50,
                checkbox: true,
            },
            {
                field: 'title',
                title: '活动标题',
                width: 100,
            },
            {
                field: 'content',
                title: '活动内容',
                width: 150,
                formatter: function(value,row,index){
                    return sliceText(row.content,25);
                }
            },
            {
                field: 'begin_time',
                title: '开始时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.begin_time).minute;
                }
            },
            {
                field: 'end_time',
                title: '结束时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.end_time).minute;
                }
            },
            {
                field: 'publisher',
                title: '发布人',
                width: 50,
                formatter: function(value,row,index){
                        return row.publisher.userName;
                }
            },
            {
                field: 'state',
                title: '活动状态',
                width: 50,
            },
            {
                field: 'create_time',
                title: '创建时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.create_time).minute;
                }
            },
        ]],
        onLoadSuccess: function (data) {
            if (data.total == 0) {
                $.messager.alert('系统提示', '未查找到相关记录', 'info');
            }
        },
        view: detailview,
        detailFormatter: function(rowIndex,rowData){
            return '<table><tr>'+
                    '<td rowspan=2 style="border:0"><img src="uploadFiles/'+rowData.file+'" style="height:50px;"></td>'+
                    '<td valign="top" style="border:0;padding-left:10px;">'+
                    '<p style="padding:0;margin:0;">活动内容：'+rowData.content+'</p>'+
                    '</td>'+
                    '</tr></table>';
        }
    });
    //新增营销活动弹窗，上传
    $('#activity_add').dialog({
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
                    $('#activity_add').form('submit',{
                        url: '/marketinginfo/activity/add',
                        onSubmit : function(){
                            var isValid = $('#activity_add').form('validate');
                            if(isValid){
                                $.messager.progress({
                                    text: '正在尝试提交...',
                                });
                            }
                            return isValid;
                        },
                        success: function (data) {
                            $.messager.progress('close');
                            data=JSON.parse(data);//返回的为JSON字符串，需转换为JSON对象
                            if (data.state > 0) {
                                $.messager.show({
                                    title: '提示',
                                    msg: '新增营销活动信息成功！',
                                });
                                $('#activity_add').dialog('close').form('reset');
                                $('#activity').datagrid('reload');
                            } else {
                                $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                            }
                        }
                    });
                }
            },
            {
                text : '取消',
                iconCls : 'icon-redo',
                handler : function () {
                    $('#activity_add').dialog('close').form('reset');
                }
            }
        ]
    });
    //修改营销活动信息弹窗，上传
    $('#activity_edit').dialog({
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
                    $('#activity_edit').form('submit',{
                        url: '/marketinginfo/activity/update',
                        onSubmit : function(){
                            var isValid = $('#activity_edit').form('validate');
                            if(isValid){
                                $.messager.progress({
                                    text: '正在尝试提交...',
                                });
                            }
                            return isValid;
                        },
                        success: function (data) {
                            $.messager.progress('close');
                            data=JSON.parse(data);//返回的为JSON字符串，需转换为JSON对象
                            if (data.state > 0) {
                                $.messager.show({
                                    title: '提示',
                                    msg: '修改营销活动信息成功！',
                                });
                                $('#activity_edit').dialog('close').form('reset');
                                $('#activity').datagrid('reload');
                            } else {
                                $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                            }
                        }
                    });
                }
            },
            {
                text : '取消',
                iconCls : 'icon-redo',
                handler : function () {
                    $('#activity_edit').dialog('close').form('reset');
                },
            }
        ]
    });
    //页面按钮
    $('#picture,#picture_edit').filebox({
        buttonText : '选择文件',
    });
    $('#state,#state_edit').combobox({
        data : [{
            "id" : 1,
            "text" : "未开始",
            "selected" : "true"
        },{
            "id" : 2,
            "text" : "已上线",
        },{
            "id" : 3,
            "text" : "已结束",
        }],
        valueField : 'text',
        textField : 'text'
    });
    $('#begin_time,#end_time').datetimebox({
        required : true,
        showSeconds : true
    });
    $('#begin_time_edit,#end_time_edit').datetimebox({
        required : true,
        showSeconds : true
    });
    //工具方法
    marketing_tool = {
        //新增
        add : function () {
            $('#activity_add').dialog('open');
            $('input[name="title"]').focus();
        },
        //编辑
        edit : function () {
            var rows = $('#activity').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 编辑记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                $.ajax({
                    type : 'POST',
                    url : '/marketinginfo/activity/edit',
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
                            $('#activity_edit').form('load', {
                                id : data._id,
                                title_edit : data.title,
                                content_edit : data.content,
                                publisher_edit : data.publisher.userName,
                                state_edit : data.state,
                                begin_time_edit : timeFormat(data.begin_time).minute,
                                end_time_edit : timeFormat(data.end_time).minute,
                                create_time_edit : timeFormat(data.create_time).minute
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
            var rows = $('#activity').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm(' 确定', ' 您要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i]._id);
                        }
                        $.ajax({
                            type : 'POST',
                            url : '/marketinginfo/activity/remove',
                            data : {
                                ids : ids.join(','),
                            },
                            beforeSend : function () {
                                $('#activity').datagrid('loading');
                            },
                            success : function (data) {
                                if (data.affected_rows) {
                                    $('#activity').datagrid('loaded');
                                    $('#activity').datagrid('reload');
                                    $('#activity').datagrid('unselectAll');
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
        //上线
        online : function () {
            var rows = $('#activity').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 上线记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                if(rows[0].state=="已上线" || rows[0].state=="已结束"){
                    $.messager.alert(' 警告操作', ' 该条记录' + rows[0].state + '！', 'warning');
                } else {
                    $.ajax({
                        type : 'POST',
                        url : '/marketinginfo/activity/online',
                        data : {
                            id : rows[0]._id,
                        },
                        beforeSend : function () {
                            $('#activity').datagrid('loading');
                        },
                        success : function (data) {
                            if (data.state > 0) {
                                $('#activity').datagrid('loaded');
                                $('#activity').datagrid('reload');
                                $.messager.show({
                                    title: '提示',
                                    msg: '营销活动信息上线成功！',
                                });
                            } else {
                                $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                            }
                        }
                    });
                }
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 上线记录至少选定一条数据！', 'warning');
            }
        },
        //下线
        offline : function () {
            var rows = $('#activity').datagrid('getSelections');
            if (rows.length > 1) {
                $.messager.alert(' 警告操作', ' 下线记录只能选定一条数据！', 'warning');
            } else if (rows.length == 1) {
                if(rows[0].state=="未开始" || rows[0].state=="已下线"){
                    $.messager.alert(' 警告操作', ' 该项营销活动' + rows[0].state + '！', 'warning');
                } else {
                    $.ajax({
                        type : 'POST',
                        url : '/marketinginfo/activity/offline',
                        data : {
                            id : rows[0]._id,
                        },
                        beforeSend : function () {
                            $('#activity').datagrid('loading');
                        },
                        success : function (data) {
                            if (data.state > 0) {
                                $('#activity').datagrid('loaded');
                                $('#activity').datagrid('reload');
                                $.messager.show({
                                    title: '提示',
                                    msg: '营销活动信息下线成功！',
                                });
                            } else {
                                $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                            }
                        }
                    });
                }
            } else if (rows.length == 0) {
                $.messager.alert(' 警告操作', ' 下线记录至少选定一条数据！', 'warning');
            }
        },
        //取消所有选定
        redo : function () {
            $('#activity').datagrid('unselectAll');
        },
        //当前页面刷新
        reload : function () {
            $('#activity').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#activity').datagrid('load',{
                search_activity : $.trim($('input[name="search_activity"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#activity_search').form('reset');
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