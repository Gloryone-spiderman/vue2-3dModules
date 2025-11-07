module.exports={
    root:true,              // 表示当前配置文件为根配置文件，不会再向上查找
    env:{
        browser:true,       // 浏览器环境
        node:true           // node环境
    },
    'extends':[
        'plugin:vue/essential',     // vue插件的基本规则
        'eslint:recommended'        // eslint的推荐规则
    ],
    rules:{
        // 生产环境下不允许使用console
        'no-console':process.env.NODE_ENV==='production'?'warn':'off',      
        // 生产环境下不允许使用debugger
        'no-debugger':process.env.NODE_ENV==='production'?'warn':'off'       
    },
    parserOptions:{
        // 使用babel-eslint解析器
        parser:'babel-eslint'
    }
}
