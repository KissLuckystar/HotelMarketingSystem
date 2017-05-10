/**
 * 电子预售券销量统计
 */
$(function() {

    $('#sale-pie').hide();

    $('#search_stock').combobox({
        data : [{
            "id" : 1,
            "text" : "彩虹计划-1个月",
            "selected" : "true"
        }],
        valueField : 'text',
        textField : 'text'
    });
    //工具方法
    stock_tool = {
        search : function () {
            if ($('#stock_search').form('validate')) {
                $.ajax({
                    url: '/salesstatistics/productstock/data',
                    type: 'POST',
                    data: {
                        search_stock: $('input[name="search_stock"]').val()
                    },
                    beforeSend: function () {
                        $.messager.progress({
                            text: '正在尝试提交...',
                        });
                    },
                    success: function (data, response, status) {
                        $.messager.progress('close');
                        var arr=[];
                        arr.push(data.product);
                        if (data.state > 0) {
                            $('#stock').datagrid({
                                data:arr,
                                height: 200,
                                fitColumns: true,
                                striped: true,
                                rownumbers: true,
                                border: false,
                                sortName: 'date',
                                sortOrder: 'desc',
                                columns: [[
                                    {
                                        field: 'name',
                                        title: '产品名称',
                                        width: 100,
                                    },
                                    {
                                        field: 'user_id',
                                        title: '发行人',
                                        width: 50,
                                        formatter: function(value,row,index){
                                            return row.user_id.name;
                                        }
                                    },
                                    {
                                        field: 'annual_rate',
                                        title: '年化奖励率(%)',
                                        width: 100
                                    },
                                    {
                                        field: 'total_amount',
                                        title: '发行总额(元)',
                                        width: 100
                                    },
                                    {
                                        field: 'min_amount',
                                        title: '起购金额(元)',
                                        width: 100
                                    },
                                    {
                                        field: 'max_amount',
                                        title: '限购金额(元)',
                                        width: 100
                                    },
                                    {
                                        field: 'start_sell',
                                        title: '发售时间',
                                        width: 100,
                                        formatter: function(value,row,index){
                                            return timeFormat(row.start_sell).minute;
                                        }
                                    },
                                    {
                                        field: 'end_sell',
                                        title: '停售时间',
                                        width: 100,
                                        formatter: function(value,row,index){
                                            return timeFormat(row.end_sell).minute;
                                        }
                                    },
                                    {
                                        field: 'start_interest',
                                        title: '起息时间',
                                        width: 100,
                                        formatter: function(value,row,index){
                                            return timeFormat(row.start_interest).minute;
                                        }
                                    },
                                    {
                                        field: 'end_interest',
                                        title: '止息时间',
                                        width: 100,
                                        formatter: function(value,row,index){
                                            return timeFormat(row.end_interest).minute;
                                        }
                                    },
                                    {
                                        field: 'left_amount',
                                        title: '剩余金额',
                                        width: 100
                                    },
                                    {
                                        field: 'audit_state',
                                        title: '审计状态',
                                        width: 50
                                    },
                                    {
                                        field: 'maintain_state',
                                        title: '维护状态',
                                        width: 50
                                    },
                                    {
                                        field: 'protocol_id',
                                        title: '服务协议',
                                        width: 50,
                                        formatter: function(value,row,index){
                                            return row.protocol_id.name;
                                        }
                                    },
                                    {
                                        field: 'create_time',
                                        title: '创建时间',
                                        width: 100,
                                        formatter: function(value,row,index){
                                            return timeFormat(row.create_time).minute;
                                        }
                                    },
                                    {
                                        field: 'note',
                                        title: '备注',
                                        width: 100
                                    }
                                ]],
                                onLoadSuccess: function (data) {
                                    if (data.total == 0) {
                                        $.messager.alert('系统提示', '未查找到相关记录', 'info');
                                    }
                                }
                            });
                            $('#sale-pie').show();
                            // 基于准备好的dom，初始化echarts实例
                            var pieChart = echarts.init(document.getElementById('sale-pie'));

                            // 指定图表的配置项和数据
                            var pieoption = {
                                title : {
                                    text: '电子预售券存量统计',
                                    subtext: '统计结果来源于实时销售数据',
                                    x:'center'
                                },
                                tooltip : {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                                },
                                toolbox: {
                                    feature: {
                                        saveAsImage: {}
                                    }
                                },
                                legend: {
                                    orient: 'vertical',
                                    left: 'left',
                                    data: ['存量金额','已销售金额']
                                },
                                series : [
                                    {
                                        name: '访问来源',
                                        type: 'pie',
                                        radius : '55%',
                                        center: ['50%', '60%'],
                                        data:[
                                            {value:data.product.left_amount, name:'存量金额'},
                                            {value:data.product.total_amount-data.product.left_amount, name:'已销售金额'}
                                        ],
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }
                                    }
                                ]
                            };
                            // 使用刚指定的配置项和数据显示图表。
                            pieChart.setOption(pieoption);
                        } else {
                            $.messager.alert('警告操作', '网络或服务器错误，请重新提交！', 'warning');
                        }
                    }
                });
            }
        },
        //重置搜索框
        reset : function () {
            $('#stock_search').form('reset');
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