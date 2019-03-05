$ = require('./object');

require('./extension');

$.Session = require('./session');
$.Http = require('./http');
$.Sys = require('./sys');
$.Modal = require('./modal');
$.Err = require('./err');
$.Wui = require('./wui');
$.String = require('./string');
$.Model = require('./model');
$.Url = require('./url');

/**
 * 初始化Welib库，目前支持的配置如下（问号表示可选字段）：
 * host?            指定用于所有请求的主机地址
 * wui?             Wui组件配置，参见各Wui组件说明文档
 *
 * @param {Object?} config 配置信息
 * @author Deng Nianchen
 */
$.initial = function(config = {}) {
	$($).each((key, value) => {
		if (typeof value._initial === "function")
			value._initial(config);
	});
};

module.exports = $;