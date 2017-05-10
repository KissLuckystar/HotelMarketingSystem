/**
 * Created by smk on 2017/4/27.
 * 账单管理
 */
$(function(){
    $('#bill').datagrid({
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
        toolbar: '#bill_tool',
        columns: [[
            {
                field: 'product',
                title: '产品名称',
                width: 100,
                formatter: function(value,row,index){
                    return row.product_id.name;
                }
            },
            {
                field: 'appuserid',
                title: '购买者账户',
                width: 50,
                formatter: function(value,row,index){
                    return row.appuser_id.account_money;
                }
            },
            {
                field: 'appuser',
                title: '购买者',
                width: 50,
                formatter: function(value,row,index){
                    return row.appuser_id.name;
                }
            },
            {
                field: 'recharge',
                title: '购买金额（元）',
                width: 100,
            },
            {
                field: 'back',
                title: '赠送金额（元）',
                width: 50,
            },
            {
                field: 'way',
                title: '充值方式',
                width: 50
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
                title: '购买时间',
                width: 100,
                formatter: function(value,row,index){
                    return timeFormat(row.create_time).minute;
                }
            },
            {
                field: 'state',
                title: '状态',
                width: 50,
            }
        ]],
        onLoadSuccess: function (data) {
            if (data.total == 0) {
                $.messager.alert('系统提示', '未查找到相关记录', 'info');
            }
        }
    });

    //工具方法
    bill_tool = {
        //当前页面刷新
        reload : function () {
            $('#bill').datagrid('reload');
        },
        //搜索
        search : function () {
            $('#bill').datagrid('load',{
                search_bill : $.trim($('input[name="search_bill"]').val())
            });
        },
        //重置搜索框
        reset : function () {
            $('#bill_search').form('reset');
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

