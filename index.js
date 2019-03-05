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
 * 若未指定参数，则默认读取App.globalData.config.welib作为配置对象
 *
 * @param {Object?} config 配置信息
 * @author Deng Nianchen
 */
$.initial = function(config = null) {
	if (!config) {
		try {
			config = $.AppData.config.welib || {};
		} catch (ex) {
			config = {};
		}
	}
	$($).each((key, value) => {
		if (value && typeof value._initial === "function")
			value._initial(config);
	});
};

module.exports = $;