/**
 * Created by smk on 2016/12/6.
 * 存放路由文件
 */
module.exports=function(app){
    app.get('/',function(req,res){
        res.redirect('/signin');//返回到登录页面
    });
    app.use('/signin',require('./signin'));//登录
    //app.use('/signup',require('./signup'));//注册
    app.use('/signout',require('./signout'));//退出
    app.use('/mainIndex',require('./mainIndex'));//首页
    //子功能路由区
    app.use('/collocation',require('./collocation'));//配置管理
    app.use('/authority',require('./authority'));//权限管理
    app.use('/marketinginfo',require('./marketinginfo'));//权限管理
    app.use('/accountbill',require('./accountbill'));//账户账单
    app.use('/product',require('./product'));//账户账单
};