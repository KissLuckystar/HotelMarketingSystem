/**
 * Created by smk on 2017/4/17.
 * 后台管理系统主页面js文件
 */
$(function(){
    $("#tabs").tabs({
        fit:true,
        border:false,
    });

    //导航栏
    $("#menu").accordion({
        width : 180,
        fit : true,
        border:false,
        animate : false,
    });
    //子菜单，采用树形结构
    //配置管理
    $("#collocation_nav").tree({
        //url:'/authority/userfunc/collocation',
        data : [{
            "text" : "酒店管理",
            "iconCls" : "icon-application",
            "url" : "/collocation/hotel",
        }],
        //method:'get',
        lines:true,
        onClick : function (node) {
            if (node.url) {
                if ($('#tabs').tabs('exists', node.text)) {
                    $('#tabs').tabs('select', node.text);
                } else {
                    $('#tabs').tabs('add', {
                        title: node.text,
                        closable: true,
                        iconCls : node.iconCls,
                        href : node.url ,
                    });
                }
            }
        }
    });
    $.parser.parse();
    //营销信息管理
    $("#marketinginfo_nav").tree({
        //url:'/authority/userfunc/marketinginfo',
        data : [{
            "text" : "营销活动管理",
            "iconCls" : "",
            "url" : "/marketinginfo/activity",
        }],
        lines:true,
        onClick : function (node) {
            if (node.url) {
                if ($('#tabs').tabs('exists', node.text)) {
                    $('#tabs').tabs('select', node.text);
                } else {
                    $('#tabs').tabs('add', {
                        title: node.text,
                        closable: true,
                        iconCls : node.iconCls,
                        href : node.url ,
                    });
                }
            }
        }
    });
});