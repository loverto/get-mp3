# 接力图书音频下载

利用nodejs、Fiddler和PC版微信 获取微信公众号上的授权音频文件。

给家里小孩买的有一套接力的绘本图书。也买了一套毛毛虫笔，接力绘本提供了微信公众号的音频，毛毛虫笔有自定义音频功能，这里利用爬虫功能把音频爬下来。
核心技术点用到了Fiddler抓包工具，分析接力公众号的请求内容。
Nodejs 编写了一个爬虫，把音频下载下来，然后保存到本地。
nodejs 爬虫技术点：

[ ]: # Language: nodejs

nodejs 的技术组件用到：

sync-request: # Language: nodejs

cheerio: # Language: nodejs

## 接力图书音频下载

```http request
GET http://activity.swanreads.com/yy/index/id/6/page/13.html HTTP/1.1
Host: activity.swanreads.com
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63070517)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Cookie: PHPSESSID=i3vtg887gf9fdpqeo1kg5toqo4
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7


HTTP/1.1 200 OK
Date: Sat, 30 Jul 2022 10:18:47 GMT
Server: Apache/2.4.37 (Win32) OpenSSL/1.0.2p PHP/5.6.39
X-Powered-By: ThinkPHP
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: private
Pragma: no-cache
Transfer-Encoding: chunked
Content-Type: text/html; charset=utf-8
```

