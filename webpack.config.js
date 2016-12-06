var webpack=require('webpack');

module.exports={
    //配置入口文件，可以以对象的形式配置，也可以以数组的形式配置
    entry:'./app.js',
    //输出文件出口
    /**
     * path:输出路径
     * filename:输出文件名
     */
    output:{
        path:'./',
        filename:'bundle.js'
    },
    module:{
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader!jsx-loader?harmony'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
        //loaders:[
        //    {test:/\.js$/,loader:'babel-loader'},//babel加载器可以将jsx语法转换为js的语法，也可以将es6的语法转换为es5的语法标准
        /**
         * 可以继续增加其他的加载器
         */
        //]
    },
    node: {
        fs: "empty"
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.json'],
    },
    // 插件项
    plugins : [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]
}