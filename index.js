require('./extension');

$ = require('./object');
$.Session = require('./session');
$.Http = require('./http');
$.PageExt = require('./page-ext');
$.App = require('./app');
$.Sys = require('./sys');
$.Modal = require('./modal');
$.Err = require('./err');
$.Wui = require('./wui');

/**
 * 初始化Welib库，目前支持的配置如下（问号表示可选字段）：
 * host             指定用于所有请求的主机地址
 * pageBeforeLoad?  页面初始化定制函数
 *
 * @param {Object} config 配置信息
 * @author Deng Nianchen
 */
$.initial = function(config) {
	$($).each((key, value) => {
		if (typeof value._initial === "function")
			value._initial(config);
	});
};

module.exports = $;