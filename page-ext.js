/**
 * 包含原生Page对象的扩展工具函数
 *
 * @author Deng Nianchen
 */
let pageUtils = {
	
	/**
	 * 获取页面的带参数路径，格式为path/of/page[?arg1=val1&arg2=val2...]
	 *
	 * @returns {String}
	 * @author Deng Nianchen
	 */
	getPath() {
		let path = "/" + this.route;
		if (!$(this.options).isEmpty())
			path += `?${$(this.options).urlParams()}`;
		return path;
	},
	
	/**
	 * 获取经过Url编码的页面路径
	 * @returns {String}
	 * @see getPath
	 * @author Deng Nianchen
	 */
	getPathEncoded() {
		let path = "/" + this.route;
		if (!$(this.options).isEmpty())
			path += `?${$(this.options).urlParams()}`;
		return encodeURIComponent(path);
	},
	
	/**
	 * 设置页面全局加载标志位，用于决定页面是否显示“加载中”画面
	 * 若isLoading=false，则可额外设置异常信息（用于页面加载失败时显示错误）
	 *
	 * @param {Boolean} isLoading
	 * @param {Object?} ex
	 * @author Deng Nianchen
	 */
	setLoading(isLoading, ex) {
		if (isLoading)
			this.setData({ loading: true, loadingError: null });
		else if (!isLoading && !ex)
			this.setData({ loading: false, loadingError: null });
		else {
			console.log('加载失败', ex);
			this.setData({
				loading: false,
				loadingError: ex
			});
		}
	},
	
	/**
	 * 重新载入当前页面
	 *
	 * @author Deng Nianchen
	 */
	reloadPage() {
		console.log ("Reload page");
		this.onLoad(this.loadOptions);
	}
	
};


/**
 * 页面初始化定制函数
 *
 * @type {Function}
 * @author DengNianchen
 */
let pageLoadingFunction = function() {};

/**
 * 包装微信小程序默认的Page函数，可以在小程序对页面初始化前进行一些额外的公共操作
 *
 * @author Deng Nianchen
 */
(function () {
	const originPageFunction = Page;
	Page = function(page) {
		// 添加页面数据loading=true，用于显示“加载中”提示画面
		page.data = $.extend(page.data, { loading: true });
		// 插入工具函数
		$(page).extend(pageUtils);
		
		// 包装onLoad函数，进行加载时的通用操作
		const pageOnLoad = page.onLoad;
		page.onLoad = async function(options) {
			try {
				this.setLoading(true);
				this.loadOptions = options;
				await pageLoadingFunction.call(this);
				// 设置全局配置
				this.setData({ '$': $.App.all });
				// 调用onLoad函数（若存在）进行页面加载
				if (pageOnLoad instanceof Function)
					await pageOnLoad.call(this, options);
				this.setLoading(false);
			} catch (ex) {
				this.setLoading(false, ex);
			}
		};
		
		// 调用小程序默认的Page函数进行页面初始化
		originPageFunction(page);
	};
})();

/**
 *
 */
class PageExt {
	
	/**
	 * 模块初始化函数
	 * 设置页面初始化定制函数
	 * 支持的配置字段如下：
	 * pageBeforeLoad: 可选，页面初始化定制函数
	 *
	 * @param {Object} config 配置信息
	 * @protected
	 * @author Deng Nianchen
	 */
	static _initial(config) {
		if (config.pageBeforeLoad)
			pageLoadingFunction = config.pageBeforeLoad;
	}
	
}

module.exports = PageExt;
