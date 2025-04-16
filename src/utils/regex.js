const regex = [
    {
        label: '带端口号的网址(或ip)',
        value: 'urlOrIpWithPort',
        regexp: /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/,
        examples: ['https://www.qq.com:8080', '127.0.0.1:5050', 'baidu.com:8001', 'http://192.168.1.1:9090'],
        counterExamples: ['192.168.1.1', 'https://www.jd.com']
    },
    {
        // 参考:
        // https://baike.baidu.com/item/%E9%A1%B6%E7%BA%A7%E5%9F%9F%E5%90%8D#4_1
        // https://baike.baidu.com/item/%E9%A1%B6%E7%BA%A7%E5%9F%9F%E5%90%8D#7
        // 也参考谷歌浏览器的地址栏, 如果输入非字母不会被识别为域名
        label: '网址(URL)',
        value: 'URL',
        regexp: /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/,
        examples: ['www.qq.com', 'https://vuejs.org/v2/api/#v-model', 'www.qq.99', '//www.qq.com', 'www.腾讯.cs', 'ftp://baidu.qq', 'http://baidu.com', 'https://www.amap.com/search?id=BV10060895&city=420111', '360.com:8080/vue/#/a=1&b=2']
    },
    {
        label: '域名(非网址, 不包含协议)',
        value: 'domainWithoutProtocol',
        regexp: /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/,
        examples: ['www.baidu.com', 'baidu.com', 'baidu.com.cn', 'api.baidu.com', 'nodejs.org', 'nodejs.cn'],
        counterExamples: ['http://baidu.com', 'https://baidu.com', 'www.百度.com']
    },
    {
        label: '版本号，格式必须为X.Y.Z',
        value: 'version',
        regexp: /^\d+(?:\.\d+){2}$/,
        examples: ['16.3.10']
    },
    {
        label: '日期(宽松)',
        value: 'dateLoose',
        regexp: /^\d{1,4}(-)(1[0-2]|0?[1-9])\1(0?[1-9]|[1-2]\d|30|31)$/,
        examples: ['1990-12-12', '1-1-1', '0000-1-1'],
        counterExamples: ['2020-00-01']
    },
    {
        label: '日期(严谨, 支持闰年判断)',
        value: 'dateStrict',
        regexp: /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/,
        examples: ['1990-12-12', '2000-02-29'],
        counterExamples: ['2021-02-29']
    },
    {
        label: '24小时制时间（HH:mm:ss）',
        value: '24hourClock',
        regexp: /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        examples: ['23:34:55']
    },
    {
        label: '12小时制时间（hh:mm:ss）',
        value: '12hourClock',
        regexp: /^(?:1[0-2]|0?[1-9]):[0-5]\d:[0-5]\d$/,
        examples: ['11:34:55'],
        counterExamples: ['23:34:55']
    },
    {
        label: '可以被moment转化成功的时间 YYYYMMDD HH:mm:ss',
        value: 'datetime',
        regexp: /^\d{4}([/:-\S])(1[0-2]|0?[1-9])\1(0?[1-9]|[1-2]\d|30|31) (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        examples: ['2020/01/01 23:59:59', '2020-01-01 00:00:00', '20200101 11:11:11'],
        counterExamples: ['2020/00/01 23:59:59', '2020-01/01 23:59:59', '2020-01-01 23:59:61', '2020-01-0100:00:00']
    },
    {
        label: '数字/货币金额（支持负数、千分位分隔符）',
        value: 'amount',
        regexp: /^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
        examples: [100, -0.99, 3, 234.32, -1, 900, 235.09, '12,345,678.90']
    },
    {
        label: '用户名校验：4到16位（字母，数字，下划线，减号）',
        value: 'userName',
        regexp: /^[\w-]{4,16}$/,
        examples: ['xiaohua_qq']
    },
    {
        label: '账号校验(字母开头，允许5-16字节，允许字母数字下划线组合)',
        value: 'account',
        regexp: /^[a-zA-Z]\w{4,15}$/,
        examples: ['justin', 'justin1989', 'justin_666']
    },
    {
        label: '密码校验：最少6位，含大小写字母数字及特殊字符',
        value: 'password',
        regexp: /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/,
        examples: ['Kd@curry666']
    },
    {
        label: '密码校验: 含大写字母，小写字母，数字，特殊符号中的任意3项',
        value: 'passwordStrict',
        regexp: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/,
        examples: ['a1@', 'A1@', 'Aa@']
    },
    {
        label: '微信号校验：以字母开头，可包含字母，数字，减号，下划线的6至20位账号',
        value: 'wxAccount',
        regexp: /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/,
        examples: ['github666', 'kd_-666']
    },
    {
        label: 'qq号校验',
        value: 'qqNumber',
        regexp: /^[1-9][0-9]{4,10}$/,
        examples: [903013545, 9020304]
    },
    {
        label: 'email(邮箱)',
        value: 'email',
        regexp: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        examples: ['90203918@qq.com', 'nbilly@126.com', '汉字@qq.com']
    },
    {
        label: 'email(支持中文邮箱)',
        value: 'emailWithChinese',
        regexp: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        examples: ['90203918@qq.com', 'nbilly@126.com', '啦啦啦@126.com']
    },
    {
        label: '身份证号(1代,15位数字)',
        value: 'IDNumberV1',
        regexp: /^[1-9]\d{7}(?:0\d|10|11|12)(?:0[1-9]|[1-2][\d]|30|31)\d{3}$/,
        examples: ['123456991010193']
    },
    {
        label: '身份证号(2代,18位数字),最后一位是校验位,可能为数字或字符X',
        value: 'IDNumberV2',
        regexp: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
        examples: ['12345619991205131x']
    },
    {
        label: '身份证号, 支持1/2代(15位/18位数字)',
        value: 'IDNumber',
        regexp: /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/,
        examples: ['622223199912051311', '12345619991205131x', '123456991010193']
    },
    {
        label: '银行卡号（10到30位, 覆盖对公/私账户）',
        value: 'bankCardNumber',
        regexp: /^[1-9]\d{9,29}$/,
        examples: [6234567890, 6222026006705354217]
    },
    {
        label: '中国手机号(严谨), 根据工信部最新公布的手机号段',
        value: 'phoneNumber',
        regexp: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[01256789]))\d{8}$/,
        examples: ['008618311006933', '+8617888829981', '19119255642', '19519255642']
    },
    {
        label: '中国手机号(宽松), 只要是13,14,15,16,17,18,19开头即可',
        value: 'phoneNumberLoose',
        regexp: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        examples: ['008618311006933', '+8617888829981', '19119255642']
    },
    {
        label: '中国手机号(最宽松), 只要是1开头即可',
        value: 'phoneNumberLoosest',
        regexp: /^(?:(?:\+|00)86)?1\d{10}$/,
        examples: ['008618311006933', '+8617888829981', '19119255642']
    },
    {
        label: '座机(tel phone)电话(国内),如: 0341-86091234',
        value: 'telPhoneInChina',
        regexp: /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/,
        examples: ['0936-4211235', '89076543', '010-12345678-1234']
    },
    {
        label: '中国省份',
        value: 'provinceInChina',
        regexp: /^浙江|上海|北京|天津|重庆|黑龙江|吉林|辽宁|内蒙古|河北|新疆|甘肃|青海|陕西|宁夏|河南|山东|山西|安徽|湖北|湖南|江苏|四川|贵州|云南|广西|西藏|江西|广东|福建|台湾|海南|香港|澳门$/,
        examples: ['浙江', '台湾'],
        counterExamples: ['哈尔滨']
    },
    {
        label: '中文姓名',
        value: 'ChineseName',
        regexp: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
        examples: ['葛二蛋', '凯文·杜兰特', '德克·维尔纳·诺维茨基']
    },
    {
        label: '英文姓名',
        value: 'EnglishName',
        regexp: /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/,
        examples: ['James', 'Kevin Wayne Durant', 'Dirk Nowitzki']
    },
    {
        label: 'html标签(宽松匹配)',
        value: 'HTMLTagsLoose',
        regexp: /<(\w+)[^>]*>(.*?<\/\1>)?/,
        examples: ['<div id="app"> 2333 </div>', '<input type="text">', '<br>']
    },
    {
        label: '匹配中文汉字和中文标点',
        value: 'ChineseCharactersAndPunctuation',
        regexp: /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/,
        examples: ["匹配中文汉字以及中文标点符号 。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥"]
    },
    {
        label: '邮政编码(中国)',
        value: 'zipCodeInChina',
        regexp: /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/,
        examples: ['734500', '100101']
    },
    {
        label: '16进制颜色',
        value: 'hexColor',
        regexp: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3}|[a-fA-F0-9]{8}|[a-fA-F0-9]{4})$/,
        examples: ['#f00', '#F90', '#000', '#fe9de8', '#f8f8f8ff', '#f003']
    },
    {
        label: 'mac地址',
        value: 'MAC',
        regexp: /^(([a-f0-9][0,2,4,6,8,a,c,e]:([a-f0-9]{2}:){4})|([a-f0-9][0,2,4,6,8,a,c,e]-([a-f0-9]{2}-){4}))[a-f0-9]{2}$/i,
        examples: ['38:f9:d3:4b:f5:51', '00-0C-29-CA-E4-66']
    },
    {
        label: '匹配连续重复的字符',
        value: 'consecutiveDuplicatePattern',
        regexp: /(.)\1+/,
        examples: ['我我我', '112233', '11234']
    },
    {
        label: '数字和英文字母组成，并且同时含有数字和英文字母',
        value: 'numberAndLetters',
        regexp: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
        examples: ['我a我1我', 'a对1']
    },
    {
        label: '数字和字母组成',
        value: 'numberAndLetter',
        regexp: /^[A-Za-z0-9]+$/,
        examples: ['james666', 'haha233hi']
    },
    {
        label: '英文字母',
        value: 'letter',
        regexp: /^[a-zA-Z]+$/,
        examples: ['Russel']
    },
    {
        label: '小写英文字母组成',
        value: 'lowercaseLetters',
        regexp: /^[a-z]+$/,
        examples: ['russel']
    },
    {
        label: '大写英文字母',
        value: 'capitalLetters',
        regexp: /^[A-Z]+$/,
        examples: ['ABC', 'KD']
    },
    {
        label: '中文和数字',
        value: 'ChineseAndNumber',
        regexp: /^((?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])|(\d))+$/,
        examples: ['哈哈哈', '你好6啊']
    },
    {
        label: '不能包含字母',
        value: 'noLetters',
        regexp: /^[^A-Za-z]*$/,
        examples: ['你好6啊', '@¥()！']
    },
    {
        label: '中文/汉字',
        value: 'ChineseCharacters',
        // regexp: /^[\u4E00-\u9FA5]+$/,
        regexp: /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
        examples: ['正则', '前端']
    },
    {
        label: '小数(支持科学计数)',
        value: 'decimalWithScientificNotation',
        regexp: /^[+-]?(\d+([.]\d*)?([eE][+-]?\d+)?|[.]\d+([eE][+-]?\d+)?)$/,
        examples: ['0.0', '0.09', '4E+4']
    },
    {
        label: '只包含数字',
        value: 'onlyNumber',
        regexp: /^\d+$/,
        examples: [12345678]
    },
    {
        label: '正整数，不包含0',
        value: 'positiveInteger',
        regexp: /^\+?[1-9]\d*$/,
        examples: [1231]
    },
    {
        label: '负整数，不包含0',
        value: 'negativeInteger',
        regexp: /^-[1-9]\d*$/,
        examples: [-1231]
    },
    {
        label: '整数',
        value: 'integer',
        regexp: /^(?:0|(?:-?[1-9]\d*))$/,
        examples: [-1231, 123, 0],
        counterExamples: ['01']
    },
    {
        label: '浮点数',
        value: 'float',
        regexp: /^(-?[1-9]\d*\.\d+|-?0\.\d*[1-9]\d*|0\.0+)$/,
        examples: ['1.23', '-1.01', '0.00']
        // allow "1.23", allow "-0.1", allow "0.00", ban "-0.00", ban "2.", allow "2.0"
    },
    {
        label: '浮点数(严格)',
        value: 'floatStrict',
        regexp: /^(-?[1-9]\d*\.\d+|-?0\.\d*[1-9])$/,
        examples: ['1.23', '-1.01']
        // allow "1.23", allow "-0.1", ban "2.", ban "2.0"
    },
    {
        label: '视频(video)链接地址（视频格式可按需增删）',
        value: 'videoURL',
        regexp: /^https?:\/\/(.+\/)+.+(\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$/i,
        examples: ['http://www.abc.com/video/wc.avi']
    },
    {
        label: '图片(image)链接地址（图片格式可按需增删）',
        value: 'imageURL',
        regexp: /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i,
        examples: ['https://www.abc.com/logo.png', 'http://www.abc.com/logo.png']
    },
    {
        label: 'base64格式',
        value: 'base64',
        regexp: /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*?)\s*$/i,
        examples: ['data:image/gif;base64,xxxx==']
    },
    {
        label: '火车车次',
        value: 'trainNumber',
        regexp: /^[GCDZTSPKXLY1-9]\d{1,4}$/,
        examples: ['G1868', 'D102', 'D9', 'Z5', 'Z24', 'Z17']
    },
    {
        label: '手机机身码(IMEI)',
        value: 'IMEI',
        regexp: /^\d{15,17}$/,
        examples: ['123456789012345', '1234567890123456', '12345678901234567']
    },
    {
        label: '统一社会信用代码',
        value: 'creditCode',
        regexp: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
        examples: ['91230184MA1BUFLT44', '92371000MA3MXH0E3W']
    },
    {
        label: '统一社会信用代码(宽松匹配)(15位/18位/20位数字/字母)',
        value: 'creditCodeLoose',
        regexp: /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/,
        examples: ['91110108772551611J', '911101085923662400']
    },
    {
        label: '迅雷链接',
        value: 'thunderURI',
        regexp: /^thunderx?:\/\/[a-zA-Z\d]+=$/,
        examples: ['thunder://QUEsICdtYWduZXQ6P3h0PXVybjpidGloOjBCQTE0RTUxRkUwNjU1RjE0Qzc4NjE4RjY4NDY0QjZFNTEyNjcyOUMnWlo=']
    },
    {
        label: 'ed2k链接(宽松匹配)',
        value: 'ed2kURILoose',
        regexp: /^ed2k:\/\/\|file\|.+\|\/$/,
        examples: ['ed2k://|file|%E5%AF%84%E7%94%9F%E8%99%AB.PARASITE.2019.HD-1080p.X264.AAC-UUMp4(ED2000.COM).mp4|2501554832|C0B93E0879C6071CBED732C20CE577A3|h=5HTKZPQFYRKORN52I3M7GQ4QQCIHFIBV|/']
    },
    {
        label: '磁力链接(宽松匹配)',
        value: 'magnetURILoose',
        regexp: /^magnet:\?xt=urn:btih:[0-9a-fA-F]{40,}.*$/,
        examples: ['magnet:?xt=urn:btih:40A89A6F4FB1498A98087109D012A9A851FBE0FC']
    },
    {
        label: 'linux"隐藏文件"路径',
        value: 'linuxHiddenFilePath',
        regexp: /^\/(?:[^/]+\/)*\.[^/]*/,
        examples: ['/usr/ad/.dd', '/root/.gitignore', '/.gitignore']
    },
    {
        label: 'linux文件夹路径',
        value: 'linuxFolderPath',
        regexp: /^\/(?:[^/]+\/)*$/,
        examples: ['/usr/ad/dd/', '/', '/root/', '/ a a / a / a a /']
    },
    {
        label: 'linux文件路径',
        value: 'linuxFilePath',
        regexp: /^\/(?:[^/]+\/)*[^/]+$/,
        examples: ['/root/b.ts', '/root/abc']
    },
    {
        label: 'window"文件夹"路径',
        value: 'windowFolderPath',
        regexp: /^[a-zA-Z]:\\(?:\w+\\?)*$/,
        examples: ['C:\\Users\\Administrator\\Desktop', 'e:\\m\\']
    },
    {
        label: 'window下"文件"路径',
        value: 'windowFilePath',
        regexp: /^[a-zA-Z]:\\(?:\w+\\)*\w+\.\w+$/,
        examples: ['C:\\Users\\Administrator\\Desktop\\qq.link', 'e:\\m\\vscode.exe']
    },
    {
        label: 'ip-v4[:端口]',
        value: 'ipv4WithPort',
        regexp: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
        examples: ['172.16.0.0', '172.16.0.0:8080', '127.0.0.0', '127.0.0.0:998']
    },
    {
        label: 'ip-v6[:端口]',
        value: 'ipv6WithPort',
        regexp: /(^(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$)|(^\[(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))\](?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$)/i,
        examples: ['2031:0000:130f:0000:0000:09c0:876a:130b', '[2031:0000:130f:0000:0000:09c0:876a:130b]:8080']
    },
    {
        label: '子网掩码(不包含 0.0.0.0)',
        value: 'subnetMask',
        regexp: /^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/,
        examples: ['255.255.255.0', '255.255.255.255', '255.240.0.0']
    },
    {
        label: '股票代码(A股)',
        value: 'stockCode',
        regexp: /^(s[hz]|S[HZ])(000[\d]{3}|002[\d]{3}|300[\d]{3}|600[\d]{3}|60[\d]{4})$/,
        examples: ['sz000858', 'SZ002136', 'sz300675', 'SH600600', 'sh601155']
    },
    {
        label: '考卷分数：>=0 && <=150, 支持小数位出现5, 如145.5',
        value: 'examScores',
        regexp: /^150$|^(?:\d|[1-9]\d|1[0-4]\d)(?:\.5)?$/,
        examples: [150, 100.5]
    },
    {
        label: 'html注释',
        value: 'htmlComment',
        regexp: /<!--[\s\S]*?-->/g,
        examples: ['<!--<div class="_bubble"></div>--><div>chenguzhen87</div><div class="_bubble"></div>-->']
    },
    {
        label: 'md5格式(32位)',
        value: 'md5',
        regexp: /^[a-fA-F0-9]{32}$/,
        examples: ['21fe181c5bfc16306a6828c1f7b762e8']
    },
    {
        label: 'GUID/UUID',
        value: 'GUID',
        regexp: /^[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}$/i,
        examples: ['e155518c-ca1b-443c-9be9-fe90fdab7345', '41E3DAF5-6E37-4BCC-9F8E-0D9521E2AA8D', '00000000-0000-0000-0000-000000000000']
    },
    {
        label: 'java包名',
        value: 'jar',
        regexp: /^([a-zA-Z_]\w*)+([.][a-zA-Z_]\w*)+$/,
        examples: ['com.bbb.name']
    },
    {
        label: 'ASCII码表中的全部的特殊字符',
        value: 'specialCharInASCII',
        regexp: /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+/,
        examples: ['[', '.', '^', '&3%']
    },
    {
        label: '护照（包含香港、澳门）',
        value: 'passportNumber',
        regexp: /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/,
        examples: ['s28233515', '141234567', '159203084', 'MA1234567', 'K25345719']
    },
    {
        label: '车牌号(新能源)',
        value: 'plateNumberWithNewEnergy',
        regexp: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))$/,
        examples: ['京AD92035', '甘G23459F', '京A19203D']
    },
    {
        label: '车牌号(非新能源)',
        value: 'plateNumber',
        regexp: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]$/,
        examples: ['京A00599', '黑D23908']
    },
    {
        label: '车牌号(新能源+非新能源)',
        value: 'plateNumberAll',
        regexp: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
        examples: ['京A12345D', '京A00599', '京AD92035', '甘G23459F', '京AA92035'],
        counterExamples: ['宁AD1234555555', '浙苏H6F681']
    },
    {
        label: '香港身份证 ',
        value: 'HKIDNumber',
        regexp: /^[a-zA-Z]\d{6}\([\dA]\)$/,
        examples: ['K034169(1)']
    },
    {
        // 参考:
        // https://baike.baidu.com/item/%E6%BE%B3%E9%97%A8%E5%B1%85%E6%B0%91%E8%BA%AB%E4%BB%BD%E8%AF%81/12509098?fr=aladdin#5
        label: '澳门身份证 ',
        value: 'MacaoIDNumber',
        regexp: /^[1|5|7]\d{6}\(\d\)$/,
        examples: ['5686611(1)']
    },
    {
        label: '台湾身份证 ',
        value: 'TaiwanIDNumber',
        regexp: /^[a-zA-Z][0-9]{9}$/,
        examples: ['U193683453']
    },
    {
        label: '军官/士兵证',
        value: 'OfficerOrSoldierCertificate',
        regexp: /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/,
        examples: ['军字第2001988号', '士字第P011816X号']
    },
    {
        label: '户口薄',
        value: 'householdNumber',
        regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        examples: ['441421999707223115']
    }
]

export default regex
