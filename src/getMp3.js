const fs = require("fs");
const cheerio = require("cheerio");
const http = require("http");



// 解析html页面，获取需要的数据，并存储到文件中

// 参数1 input_html_path ：html 路径，默认路径为：files/
// 参数2 file_path：存储文件路径，默认为当前执行脚本路径下的mp3文件夹

// 初始化参数
var input_html_path = process.argv[2];
var file_path = process.argv[3];
// 文件分隔符
var file_separator = "\\";
// 验证参数
if (!input_html_path) {
    // 打印日志，含时间戳
    console.log(`[${new Date().toLocaleString()}] 请输入html文件路径！`);
    input_html_path = __dirname + file_separator+file_separator+"html"+file_separator;
    // 打印日志，含时间戳
    console.log(`[${new Date().toLocaleString()}] 默认html文件路径为：${input_html_path}`);
}

if (!file_path) {
    // 打印日志，含时间戳
    console.log(`[${new Date().toLocaleString()}] 请输入存储文件路径！`);
    file_path = __dirname + file_separator +'mp3';
    // 打印日志，含时间戳
    console.log(`[${new Date().toLocaleString()}] 默认存储文件路径为：${file_path}`);
}
// 创建文件夹
if (!fs.existsSync(file_path)) {
    // 打印日志，含时间戳
    console.log(`[${new Date().toLocaleString()}] 创建文件夹：${file_path}`);
    fs.mkdirSync(file_path);
}

// 读取files 下所有的文件夹及文件夹下的文件列表
var files = fs.readdirSync(input_html_path);
// 声明文件清单
var files_list = [];
// 遍历文件夹下的文件列表
for (var i = 0; i < files.length; i++) {
// 获取文件夹下的文件名
    var file_name = files[i];
    // 获取文件夹路径
    var file_path3 = input_html_path + file_name;
    // 获取文件夹下的文件列表
    var file_list = fs.readdirSync(file_path3);
    // 遍历文件列表
    for (var j = 0; j < file_list.length; j++) {
        // 获取文件名
        var file_name = file_list[j];
        // 获取文件路径
        var file_path2 = file_path3 +file_separator + file_name;
        files_list.push(file_path2);
    }
}
// 打印日志，含时间戳
console.log(`[${new Date().toLocaleString()}] 开始解析html文件！`);
// 遍历文件列表
for (var w = 0; w < files_list.length; w++) {
    // 获取文件绝对路径
    var input_html_name = files_list[w];
    // 获取末级文件夹，不是文件名
    var last_folder = input_html_name.split(file_separator )[input_html_name.split(file_separator).length - 2];

    // 打印日志，含时间戳
    console.log(`[${new Date().toLocaleString()}] 解析文件：${input_html_name}`);
// 读取html文件
    var html = fs.readFileSync(input_html_name, 'utf8');
// 解析html文件
    var $ = cheerio.load(html);
// 获取需要的数据 <div class="list-block media-list words-list">
    var list = $('div.list-block.media-list.words-list');
// 获取每一个div <div class="item-title">的html数据
//<li>
// 		<a href="javascript:;" class="item-link item-content typeli">
//         <div class="item-media">1</div>
//         <div class="item-inner">
//             <div class="item-title">Farm animals</div>
//             <div class="item-subtitle"></div>
//         </div>

//     </a>
// </li>
    var resource_list = [];
    list.find('li').each(function (i, elem) {
            var file_name = $(this).find('div.item-title').text();
            var resource = {title: file_name, url: ''};
            resource_list.push(resource);
        }
    );

// 在整个文档中获取javascript标签, 及其内部var arr = 的内容
    var scripts = $('script');

    scripts.each(function (i, elem) {
            var script = $(this).html();
            // 获取arr数组
            var reg = /var arr = (.*);/;
            var result = reg.exec(script);
            if (result) {
                var arr = JSON.parse(result[1]);
                for (var i = 0; i < arr.length; i++) {
                    var resource = resource_list[i];
                    resource.url = arr[i];
                }
            }
        }
    );

//

// 定义baseurl 信息
    var baseurl = 'http://activity.swanreads.com';
    // 声明文件路径
    var file_first_path = "";
// 遍历resource_list，获取url，并下载mp3文件
    for (var i = 0; i < resource_list.length; i++) {
        // 获取第一个元素的标题名为文件名
        if (i == 0) {
            file_first_path = resource_list[i].title;
        }
        var resource = resource_list[i];
        var url = baseurl + resource.url;
        var file_name = resource.title + '.mp3';
        let dir = file_path + file_separator + last_folder + file_separator + file_first_path  + file_separator;
        // 判断文件夹是否存在
        if (!fs.existsSync(dir)) {
            // 打印日志，含时间戳
            console.log(`[${new Date().toLocaleString()}] 创建文件夹：${dir}`);
            // 创建文件夹和子文件夹
            fs.mkdirSync(dir, {recursive: true});
        }
        var local_file_path = dir + file_name;
        // 下载mp3文件
        download(url, local_file_path);
    }

// 下载mp3文件
    function download(url, file_path) {
        // 打印日志，含时间戳
        console.log(`[${new Date().toLocaleString()}] 下载文件：${url}，存储路径：${file_path}`);
        // 判断文件是否存在,且文件大小大于100字节
        if (fs.existsSync(file_path) && fs.statSync(file_path).size > 100) {
            // 打印日志，含时间戳
            console.log(`[${new Date().toLocaleString()}] 文件已存在：${file_path}`);
            return;
        }
        var file = fs.createWriteStream(file_path);
        // 同步读取url文件
        var request = http.get(url, function (response) {
            response.pipe(file);
        });
    }
}

