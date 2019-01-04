class App {
	
	/**
	 * 模块初始化函数
	 * 设置App全局配置
	 * 支持的配置字段如下：
	 * app: 可选，App全局配置
	 *
	 * @param config 配置信息
	 * @protected
	 * @author Deng Nianchen
	 */
	static _initial(config) {
		if (config.app)
			App.config = config.app;
	}
	
	/**
	 * 获取App全局数据对象
	 *
	 * @returns {*}
	 * @author Deng Nianchen
	 */
	static get data() {
		let gd = App._globalData;
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
		App._globalData.data = data;
	}
	
	/**
	 * 获取App全局配置对象
	 *
	 * @returns {*}
	 * @author Deng Nianchen
	 */
	static get config() {
		let gd = App._globalData;
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
		App._globalData.config = config;
	}
	
	/**
	 * 获取App全局原始数据
	 *
	 * @returns {Object}
	 * @private
	 * @author Deng Nianchen
	 */
	static get _globalData() {
		return getApp().globalData;
	}
	
}

module.exports = App;