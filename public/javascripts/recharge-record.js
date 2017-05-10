/**
 * Created by smk on 2017/5/8.
 */
$(function(){
    $('#recharge').datagrid({
        url: '/cashierdesk/recharge/record/data',
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
        toolbar: '#recharge_tool',
        columns: [[
            {
                field: 'name',
                title: '产品名称',
                width: 100,
                formatter: function(value,row,index){
                    return row.product_id.name;
                }
            },
            {
                field: 'account_money',
                title: '充值账户',
                width: 100,
                formatter: function(value,row,index){
                    return row.appuser_id.account_money;
                }
            },
            {
                field: 'recharge',
                title: '充值金额(元)',
                width: 100
            },
            {
                field: 'back',
                title: '赠送总额(元)',
                width: 50
            },
            {
                field: 'way',
                title: '充值方式',
                width: 100
            },
            {
                field: 'user_name',
                title: '操作人',
                width: 50,
                formatter: function(value,row,index){
                    return row.user_id.name;
                }
            },
            {
                field: 'create_time',
                title: '充值时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.create_time).minute;
                }
            },
            {
                field: 'state',
                title: '充值状态',
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
    recharge_tool = {
        //当前页面刷新
        reload : function () {
            $('#recharge').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#recharge').datagrid('load',{
                search_recharge : $.trim($('input[name="search_recharge"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#recharge_search').form('reset');
        }
    }
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