var webpack=require('webpack');

module.exports={
    //��������ļ��������Զ������ʽ���ã�Ҳ�������������ʽ����
    entry:'./app.js',
    //����ļ�����
    /**
     * path:���·��
     * filename:����ļ���
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
        //    {test:/\.js$/,loader:'babel-loader'},//babel���������Խ�jsx�﷨ת��Ϊjs���﷨��Ҳ���Խ�es6���﷨ת��Ϊes5���﷨��׼
        /**
         * ���Լ������������ļ�����
         */
        //]
    },
    node: {
        fs: "empty"
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.json'],
    },
    // �����
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