## 五、前端流程化控制工具gulp的使用
  * gulp现在更多的是做流程化的控制：
    - 比如我们要把一个大象放进冰箱里就需要 打开冰箱门->把大象放进冰箱->关上冰箱门；
    - 这就是一个简单的流程，使用gulp就可以规定这些流程，将这个流程自动化；
  * 我们可以使用它在项目开发过程中自动执行常见任务：
    - 比如打包一个组件库，我们可能要移除文件、copy文件，打包样式、打包组件、执行一些命令还有一键打包多个package等等都可以由gulp进行自定义流程的控制，非常的方便；

### 5.1. 安装gulp
  * 全局安装gulp的脚手架：`npm install --global gulp-cli`；
  * 然后新建文件夹gulpdemo，然后执行`npm init -y`，然后在这个项目下安装本地依赖gulp；
    - `npm install gulp -D`
  * 接下来我们在根目录下创建`gulpfile.js`文件，当gulp执行的时候会自动寻找这个文件；

### 5.2. 创建一个任务Task
  * 每个gulp任务（task）都是一个异步的JavaScript函数；
    - 此函数是一个可以接收callback作为参数的函数，或者返回一个Promise等异步操作对象，比如创建一个任务可以这样写；
      ```js
      // exports.default = (cb) => {
      //   console.log(cb);
      //   console.log('my gulp task');
        
      //   cb();
      // };

      // 另一种写法
      exports.default = () => {
        console.log('my gulp task');

        return Promise.resolve();
      };
      ```
  * 然后终端输入`gulp`就会执行我们这个任务；

### 5.3. 串行（series）和并行（parallel）
  * 串行就是任务一个一个执行，并行就是所有任务一起执行；
  * 更改gulpfile.js文件；
    ```js
    const { series, parallel } = require('gulp');

    const task1 = () => {
      console.log('task1');

      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 3000)
      });
    };

    const task2 = () => {
      console.log('task2');

      return Promise.resolve();
    };

    // exports.default = series(task1, task2);
    exports.default = parallel(task1, task2);
    ```

### 5.4. src()和dest()
  * src()表示创建一个读取文件系统的流；
  * dest()是创建一个写入到文件系统的流；

#### 5.4.1 复制文件案例
  * 根目录新建src目录用于存放我们被复制的文件，在src下随便新建几个文件；
    - `text.txt，index.js`；
  * 然后在gulpfile.js写下copy任务：将src下的所有文件复制到dist文件夹下；
    ```js
    const { src, dest } = require('gulp');

    const copy = () => {
      return src('src/*').pipe(dest('dist/'))
    };

    exports.default = copy;
    ```
  * 然后执行gulp(默认执行exports.default)，根目录下就会多了个dist文件夹；

#### 5.4.2 处理less文件
  * 安装gulp-less：`npm install -D gulp-less`；
  * 在src下新建一个`style/index.less`并写下一段less语法样式；
    ```js
    @color: #fff;
    .wrap {
      color: @color;
    }
    ```
  * 然后`gulpfile.js`写下lessTask：将style下的less文件解析成css并写入dist/style中；
    ```js
    const { src, dest } = require('gulp');
    const less = require('gulp-less');

    const lessTask = () => {
      return src('src/style/*.less').pipe(less()).pipe(dest('dist/style'));
    };

    exports.default = lessTask;
    ```
  * 最后执行`gulp`命令就会发现`dist/style/index.css`；
  * 还可以给css加兼容前缀；
    - 安装插件：`npm install gulp-autoprefixer -D`；
    - 更改`src/style/index.less`文件
      ```js
      @color: #fff;
      .wrap {
        color: @color;
        display: flex;
      }
      ```
    - 在gulpfile.js中使用gulp-autoprefixer；
    - 处理后的dist/style/index.css就变成了：
      ```js
      .wrap {
        color: #fff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
      }
      ``` 

#### 5.4.3 监听文件更改browser-sync
  * browser-sync是一个十分好用的浏览器同步测试工具，它可以搭建静态服务器，监听文件更改，并刷新页面（HMR）；
  * 安装：`npm i browser-sync -D`；
  * 然后在根目录下新建index.html；
  * 在gulpfile.js中进行配置；
    ```js
    const browserSync = require("browser-sync");
    const browserTask = () => {
      browserSync.init({
        server: {
          baseDir: "./",
        },
      });
    };

    exports.default = browserTask;
    ```
  * 终端执行gulp命令，就会打开一个浏览器窗口；
  * 首先要监听文件的改变，可以使用browserSync的watch，监听到文件改变后再刷新页面，调整gulpfile.js文件；
    ```js
    // 新增代码
    const { watch } = require('browser-sync');
    const { series } = require('gulp');

    const reloadTask = () => {
      browserSync.reload();
    };

    const browserTask = () => {
      //省略代码...

      watch('./*', series(reloadTask));
    };
    ```
  * 此时重新终端gulp运行，改动index.html文件浏览器便会刷新；
  * 在index.html中引入dist/style/index.css的样式；
  * 现在模拟一个简单的构建流：编译less文件->将css写入dist/style->触发页面更新；
    ```js
    // gulp.js文件更改
    // 新增代码
    const { src, dest, series } = require('gulp');
    const less = require('gulp-less');
    const autoprefixer = require('gulp-autoprefixer');

    const lessTask = () => {
      return src('src/style/*.less').pipe(less()).pipe(
        autoprefixer({
          overrideBrowserslist: ['> 1%', 'last 2 versions'],
          cascade: false //是否美化属性值
        })
      ).pipe(dest('dist/style'));
    };

    const browserTask = () => {
      //省略代码...

      watch('./*.html', series(reloadTask));
      //监听样式更新触发两个任务
      watch('src/style/*', series(lessTask, reloadTask));
    };
    ```
  * 此时重新终端gulp运行，无论更改的是样式还是html都可以触发页面更新；
    ```js
    // 改动src/style/index.less

    @color: #ff0000;

    .wrap {
      color: @color;
      display: flex;
      background-color: #000000;
    }
    ```
