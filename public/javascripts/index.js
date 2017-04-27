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
            "id" : 1,
            "text" : "酒店管理",
            "iconCls" : "icon-application",
            "url" : "/collocation/hotel",
        },{
            "id" : 2,
            "text" : "班组管理",
            "iconCls" : "icon-application",
            "url" : "/collocation/group",
        },{
            "id" : 3,
            "text" : "协议管理",
            "iconCls" : "icon-application",
            "url" : "/collocation/protocol",
        },{
            "id" : 4,
            "text" : "设备管理",
            "iconCls" : "icon-application",
            "url" : "/collocation/device",
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
    //权限管理
    $("#authority_nav").tree({
        data : [{
            "id" : 1,
            "text" : "用户组管理",
            "iconCls" : "icon-application",
            "url" : "/authority/usergroup",
        },{
            "id" : 2,
            "text" : "用户管理",
            "iconCls" : "icon-application",
            "url" : "/authority/user",
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
    //电子预售券管理
    $("#product_nav").tree({
        data : [{
            "id" : 1,
            "text" : "电子预售券定制",
            "iconCls" : "icon-application",
            "url" : "/product/customization",
        },{
            "id" : 2,
            "text" : "电子预售券审核",
            "iconCls" : "icon-application",
            "url" : "/product/verify",
        },{
            "id" : 3,
            "text" : "电子预售券维护",
            "iconCls" : "icon-application",
            "url" : "/product/maintain",
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
    $.parser.parse();
    //营销信息管理
    $("#marketinginfo_nav").tree({
        //url:'/authority/userfunc/marketinginfo',
        data : [{
            "text" : "营销活动管理",
            "iconCls" : "icon-application",
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