import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    envPrefix: 'ENV_', // 配置VITE注入客户端变量的前缀,
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 设置别名 '@' 表示项目根目录下的 'src' 文件夹
            '@theme': path.resolve(__dirname, 'src/theme/less/theme.less'),
        },
    },
    css: {
        preprocessorOptions: {
            // key + config key代表预处理器的名
            less: {
                // 整个的配置对象都会最终给到less的执行参数（全局参数）中去
                // 在webpack里就给less-loader去配置就好了
                math: 'always',
                javascriptEnabled: true, // Allow LESS files with JavaScript
                // globalVars: {
                //   // 全局变量
                //   mainColor: 'red'
                // }
            },
        },
        // 对css的行为进行配置
        // modules配置最终会丢给postcss modules
        modules: {
            // 是对css模块化的默认行为进行覆盖
            localsConvention: 'camelCase', // 修改生成的配置对象的key的展示形式(驼峰还是中划线形式)
            scopeBehaviour: 'local', // 配置当前的模块化行为是模块化还是全局化 (有hash就是开启了模块化的一个标志, 因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)
            generateScopedName: '[name]_[local]_[hash:5]',
            // generateScopedName: (name, filename, css) => {
            //     // name -> 代表的是你此刻css文件中的类名
            //     // filename -> 是你当前css文件的绝对路径
            //     // css -> 给的就是你当前样式
            //     console.log('name', name, 'filename', filename, 'css', css) // 这一行会输出在哪？？？ 输出在node
            //     // 配置成函数以后, 返回值就决定了他最终显示的类型
            //     return `${name}_${Math.random().toString(36).substr(3, 8)}`
            // },
            // hashPrefix: "hello", // 生成hash会根据类名 + 一些其他的字符串(文件名 + 他内部随机生成一个字符串)去进行生成, 如果想要生成hash更加的独特一点, 可以配置hashPrefix, 配置的这个字符串会参与到最终的hash生成, （hash: 只要字符串有一个字不一样, 那么生成的hash就完全不一样, 但是只要字符串完全一样, 生成的hash就会一样）
            // globalModulePaths: ["./componentB.module.css"], // 代表不想参与到css模块化的路径
        },
    },
    optimizeDeps: {
        exclude: ['chunk-QXBZU37W.js']
    },
    build: {
        outDir: 'project', // Change 'build' to your preferred directory
    },
    server: {
        port: 5177,
        host: '0.0.0.0', // Allows access from external sources
        strictPort: true,
        // proxy: {
        //     "/api": {
        //       target: "http://3.130.22.68:3000",
        //       changeOrigin: true,
        //       secure: false
        //     }
        //   }
    },
    preview: {
        allowedHosts: ['project.mangrovesai.com']// Allow the domain
    },
});
