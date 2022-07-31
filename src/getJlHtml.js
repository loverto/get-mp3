



//
// GET http://activity.swanreads.com/yy/index/id/6/page/13.html HTTP/1.1
//     Host: activity.swanreads.com
// Connection: keep-alive
// Cache-Control: max-age=0
// Upgrade-Insecure-Requests: 1
// User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63070517)
// Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
// Cookie: PHPSESSID=i3vtg887gf9fdpqeo1kg5toqo4
// Accept-Encoding: gzip, deflate
// Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7
//
//
// HTTP/1.1 200 OK
// Date: Sat, 30 Jul 2022 10:18:47 GMT
// Server: Apache/2.4.37 (Win32) OpenSSL/1.0.2p PHP/5.6.39
// X-Powered-By: ThinkPHP
// Expires: Thu, 19 Nov 1981 08:52:00 GMT
// Cache-Control: private
// Pragma: no-cache
// Transfer-Encoding: chunked
// Content-Type: text/html; charset=utf-8
//
const cheerio = require("cheerio");
const fs = require("fs");
const request = require("sync-request");
// 书的数量
var bookCount = 6;
// cookie
var cookie = 'PHPSESSID=i3vtg887gf9fdpqeo1kg5toqo4';
// base url
var baseUrl = 'http://activity.swanreads.com';
// domain
var domain = 'activity.swanreads.com';
// user agent
var userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63070517)';

// 获取页面内容
function getHtml(url) {
    var html = '';
    var options = {
        headers: {
            'User-Agent': userAgent,
            'Cookie': cookie,
            'Host': domain,
            'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            'Accept-Encoding': "gzip, deflate",
            'Upgrade-Insecure-Requests': "1",
            'Accept-Language': "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
        }
    };
    var res = request("GET",url, options);
    if (res.statusCode == 200) {
        html = res.body.toString();
    }
    return html;
}
// 动态计算页面url
function getPageUrl(url, page) {
    var pageUrl = url + '/yy/index/id/' + page + '/page/';
    return pageUrl;
}
// 声明base页面
var baseHtmlPages = [];
// 动态计算页面url
for (var i = 1; i <= bookCount; i++) {
    let pageUrl1 = getPageUrl(baseUrl, i);
    baseHtmlPages.push(pageUrl1);
}
// 获取分页的url, 终止条件为 获取需要的数据 <div class="list-block media-list words-list"> 下的ul 中无元素
baseHtmlPages.forEach(function (pageUrl) {
    //页数
    var page = 1;
    // 组装页面url
    var htmlUrl = pageUrl + page +'.html';
    // 获取页面内容
    var html = getHtml(htmlUrl);
    // 获取需要的数据
    var $ = cheerio.load(html);
    var $ul = $('div.list-block.media-list.words-list').children('ul');
    // 获取页面的title作为文件夹
    var title = $('title').text().replaceAll("我的第一本英语单词书·","");
    // 如果没有元素，则终止获取下一个页面，否则继续获取下一个页面，且保存页面到本地磁盘
    while ($ul.children().length > 0) {
        // 保存页面到本地磁盘
        var html = $.html();
        let dir = __dirname+'/html/'+title+'/';
        // 判断目录是否存在
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir,{recursive:true});
        }
        var fileName = dir + page + '.html';
        fs.writeFileSync(fileName, html);
        // 计算下一个页面
        page++;
        // 组装页面url
        htmlUrl = pageUrl + page +'.html';
        // 获取页面内容
        html = getHtml(htmlUrl);
        // 获取需要的数据
        $ = cheerio.load(html);
        $ul = $('div.list-block.media-list.words-list').children('ul');
    }
}
);