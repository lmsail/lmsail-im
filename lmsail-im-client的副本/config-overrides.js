const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        style: true, /* 注意改为true */
    }),
    //添加less加载器
    addLessLoader({
        javascriptEnabled: true,
        // 修改默认主题样式
        modifyVars: {
            "@brand-primary": "#1CAE82",
            "@brand-primary-tap": "#1DA57A",
            "color-text-base": "#333",
            "border-radius-base": "2px"
        }
    })
);
