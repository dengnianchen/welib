class App {
	
	/**
	 * 获取App全局数据对象
	 *
	 * 该方法获取App中globalData的data属性值，等效于getApp().globalData.data。
	 * 若globalData.data不存在，则会自动创建相应空对象并返回。
	 * 在Wxml的表达式中，可以使用$.data访问该对象。
	 *
	 * @returns {Object} App全局数据对象
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
	 * 该方法设置App中globalData的data属性值，等效于getApp().globalData.data = ...。
	 *
	 * @param {Object} data App全局数据对象
	 * @author Deng Nianchen
	 */
	static set data(data) {
		App.all.data = data;
	}
	
	/**
	 * 获取App全局配置对象
	 *
	 * 该方法获取App中globalData的config属性值，等效于getApp().globalData.config。
	 * 若globalData.config不存在，则会自动创建相应空对象并返回。
	 * 在Wxml的表达式中，可以使用$.config访问该对象。
	 *
	 * @returns {Object} App全局配置对象
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
	 * 该方法设置App中globalData的config属性值，等效于getApp().globalData.config = ...。
	 *
	 * @param {Object} config App全局配置对象
	 * @author Deng Nianchen
	 */
	static set config(config) {
		App.all.config = config;
	}
	
	/**
	 * 获取App全局样式对象
	 *
	 * 该方法获取App中globalData的style属性值，等效于getApp().globalData.style。
	 * 若globalData.style不存在，则会自动创建相应空对象并返回。
	 * 在Wxml的表达式中，可以使用$.style访问该对象。
	 *
	 * @returns {Object} App全局样式对象
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
	 * 该方法设置App中globalData的style属性值，等效于getApp().globalData.style = ...。
	 *
	 * @param {Object} style App全局样式对象
	 * @author Deng Nianchen
	 */
	static set style(style) {
		App.all.style = style;
	}

	/**
	 * 获取App所有全局数据
	 *
	 * 该方法获取App中globalData对象，等效于getApp().globalData。
	 * 若globalData不存在，则会自动创建相应空对象并返回。
	 * 在Wxml的表达式中，可以使用$访问该对象。
	 *
	 * @returns {Object} App所有全局数据
	 * @author Deng Nianchen
	 */
	static get all() {
		if (!getApp().globalData)
			getApp().globalData = {};
		return getApp().globalData;
	}
	
}

module.exports = App;