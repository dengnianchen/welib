class App {
	
	/**
	 * 模块初始化函数
	 * 设置App全局配置
	 * 支持的配置字段如下：
	 * app: 可选，App初始的全局数据
	 *
	 * @param config 配置信息
	 * @protected
	 * @author Deng Nianchen
	 */
	static _initial(config) {
		if (config.app)
			$(App.all).extend(config.app);
	}
	
	/**
	 * 获取App全局数据对象
	 *
	 * @returns {*}
	 * @author Deng Nianchen
	 */
	static get data() {
		let gd = App.all;
		if (!gd.data)
			gd.data = {};
		return gd.data;
	}
	
	/**
	 * 设置App全局数据对象
	 *
	 * @param {Object} data
	 * @author Deng Nianchen
	 */
	static set data(data) {
		App.all.data = data;
	}
	
	/**
	 * 获取App全局配置对象
	 *
	 * @returns {*}
	 * @author Deng Nianchen
	 */
	static get config() {
		let gd = App.all;
		if (!gd.config)
			gd.config = {};
		return gd.config;
	}
	
	/**
	 * 设置App全局配置对象
	 *
	 * @param {Object} config
	 * @author Deng Nianchen
	 */
	static set config(config) {
		App.all.config = config;
	}
	
	/**
	 * 获取App全局样式对象
	 *
	 * @returns {*}
	 * @author Deng Nianchen
	 */
	static get style() {
		let gd = App.all;
		if (!gd.style)
			gd.style = {};
		return gd.style;
	}
	
	/**
	 * 设置App全局样式对象
	 *
	 * @param {Object} style
	 * @author Deng Nianchen
	 */
	static set style(style) {
		App.all.style = style;
	}

	/**
	 * 获取App所有全局数据
	 *
	 * @returns {Object}
	 * @author Deng Nianchen
	 */
	static get all() {
		return getApp().globalData;
	}
	
}

module.exports = App;