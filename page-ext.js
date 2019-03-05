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
		if (!$(this.loadOptions).isEmpty())
			path += '?' + $.Url.toParamString(this.loadOptions);
		return path;
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
	 * 获取当前页面是否正在加载
	 *
	 * @returns {boolean} 当前页面是否正在加载
	 * @author Deng Nianchen
	 */
	isLoading() {
		return this.data.loading;
	},
	
	/**
	 * 重新载入当前页面
	 *
	 * @author Deng Nianchen
	 */
	reloadPage() {
		console.log ("Reload page");
		this.onLoad(true);
	},
	
};



/**
 * 扩展Page静态函数，提供页面有关的全局工具函数
 *
 * @author Deng Nianchen
 */
let pageStaticFunctions = {
	
	/**
	 * 获取当前页面对象
	 *
	 * @returns {Page.PageInstance<{}, {}> & {}}
	 * @author Deng Nianchen
	 */
	current() {
		let pages = getCurrentPages();
		return pages[pages.length - 1];
	},
	
	/**
	 * 拉取跨页面数据
	 *
	 * 无法重复拉取相同的元素
	 *
	 * @param {string}  key 数据名
	 * @return {*}
	 * @author Deng Nianchen
	 */
	pullData(key) {
		if (!Page.dataAcross)
			return null;
		let result = Page.dataAcross[key];
		delete Page.dataAcross[key];
		return result;
	},
	
	/**
	 * 存入跨页面数据
	 *
	 * @param {string}  key     数据名
	 * @param {*}       value   数据内容
	 * @author Deng Nianchen
	 */
	pushData(key, value) {
		if (!Page.dataAcross)
			Page.dataAcross = {};
		Page.dataAcross[key] = value;
	},
	
	/**
	 * 关闭所有页面，打开到应用内的某个页面
	 *
	 * 此函数为 wx.reLanuch 的封装，可以直接通过 options.data 指定要给目标页面传递的数据。
	 *
	 * @param {object}  option  选项
	 * @return {Promise<*>}
	 * @see wx.reLanuch
	 * @author Deng Nianchen
	 */
	async reLanuch(option = {}) {
		if (option.data) {
			if (option.url.indexOf('?') >= 0)
				option.url += '&' + $.Url.toParamString(option.data);
			else
				option.url += '?' + $.Url.toParamString(option.data);
		}
		return new Promise (((resolve, reject) => {
			wx.reLanuch($.extend(option, {
				success: resolve,
				fail: reject
			}));
		}));
	},
	
	/**
	 * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
	 *
	 * 此函数为 wx.redirectTo 的封装，可以直接通过 option.data 指定要给目标页面传递的数据。
	 *
	 * @param {object}  option  选项
	 * @return {Promise<*>}
	 * @see wx.redirectTo
	 * @author Deng Nianchen
	 */
	async redirectTo(option = {}) {
		if (option.data) {
			if (option.url.indexOf('?') >= 0)
				option.url += '&' + $.Url.toParamString(option.data);
			else
				option.url += '?' + $.Url.toParamString(option.data);
		}
		return new Promise (((resolve, reject) => {
			wx.redirectTo($.extend(option, {
				success: resolve,
				fail: reject
			}));
		}));
	},
	
	/**
	 * 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。
	 *
	 * 此函数为 wx.navigateTo 的封装，可以直接通过 option.data 指定要给目标页面传递的数据。
	 *
	 * @param {object}  option  选项
	 * @return {Promise<*>}
	 * @see wx.navigateTo
	 * @author Deng Nianchen
	 */
	async navigateTo(option = {}) {
		if (option.data) {
			if (option.url.indexOf('?') >= 0)
				option.url += '&' + $.Url.toParamString(option.data);
			else
				option.url += '?' + $.Url.toParamString(option.data);
		}
		return new Promise (((resolve, reject) => {
			wx.navigateTo($.extend(option, {
				success: resolve,
				fail: reject
			}));
		}));
	},
	
	/**
	 * 跳转到DialogPage模式的页面
	 *
	 * 该函数为异步函数，可以使用await等待跳转页面的返回结果
	 *
	 * @param {object}  option <br/>
	 *                    url:  页面路径
	 *                    data: 给目标页面传递的数据
	 * @return {Promise<*>}
	 * @author Deng Nianchen
	 */
	async navigateToDialog(option = {}) {
		let _this = Page.current();
		$(option).extend({ data: { dialog: true } });
		return new Promise((resolve, reject) => {
			_this.dialogPageResolve = resolve;
			Page.navigateTo(option).catch(res => {
				_this.dialogPageResolve = null;
				reject($.Err.FAIL(res));
			});
		});
	},
	
	/**
	 * [仅适用于DialogPage模式的页面]将数据作为页面结果返回给前页
	 *
	 * @param {object}  option <br/>
	 *                    data: 返回数据
	 * @see navigateToDialogPage
	 * @author Deng Nianchen
	 */
	async navigateReturn(option = {}) {
		Page.pushData('dialogResult', option.data);
		return new Promise (((resolve, reject) => {
			wx.navigateBack({
				success: resolve,
				fail: reject
			});
		}));
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
		page.onLoad = async function(options, isPulldownRefresh = false) {
			this.onLoadExecuting = true;
			try {
				this.setLoading(!isPulldownRefresh && true);
				if (options !== true)
					this.loadOptions = $.Url.fromParams(options);
				
				let r = await pageLoadingFunction.call(this);
				if (r === false)
					return;
				
				// 设置全局配置
				this.setData({ '$': $.AppData });
				// 调用onLoad函数（若存在）进行页面加载
				if (pageOnLoad instanceof Function) {
					let r = await pageOnLoad.call(this, this.loadOptions);
					if (r === false)
						return;
				}
				this.onLoadExecuting = false;
				// 页面加载完成后，调用onShow函数执行页面显示相关逻辑
				// 如果onShow函数已经被原生代码调用（此时会被跳过执行），则再次调用onShow
				// 否则在onLoad函数执行完毕后onShow函数会被原生代码调用
				if (this.onShowCalledByNative)
					await this.onShow(true, isPulldownRefresh);
			} catch (ex) {
				this.onLoadExecuting = false;
				if (isPulldownRefresh)
					throw ex;
				this.setLoading(false, ex);
			}
		};
		
		// 包装onShow函数，若当前页面正在加载（onLoad正在执行）则onShow函数将在页面
		// 加载完成后调用
		const pageOnShow = page.onShow;
		page.onShow = async function(callByOnLoad = false, isPulldownRefresh = false) {
			if (!callByOnLoad)
				this.onShowCalledByNative = true;
			// 页面还在执行onLoad部分的逻辑，暂时跳过onShow执行
			if (this.onLoadExecuting)
				return;
			this.setLoading(!isPulldownRefresh);
			
			try {
				// 调用onShow函数（若存在）进行页面加载
				if (pageOnShow instanceof Function)
					await pageOnShow.call(this);
				this.setLoading(false);
			} catch (ex) {
				// 如果被onLoad函数调用，则将异常抛给onLoad函数处理
				if (callByOnLoad)
					throw ex;
				this.setLoading(false, ex);
			}
			
			// 处理DialogPage的返回值
			if (this.dialogPageResolve) {
				let dialogPageResolve = this.dialogPageResolve;
				this.dialogPageResolve = null;
				dialogPageResolve(Page.pullData('dialogResult'));
			}
			
		};
		
		// 若页面没有实现onPullDownRefresh函数，则为其实现默认逻辑为刷新整个页面的内容
		if (!page.onPullDownRefresh) {
			page.onPullDownRefresh = async function() {
				if (this.isLoading() || this.data.loadingError) {
					wx.stopPullDownRefresh();
					return;
				}
				try {
					await this.onLoad(this.loadOptions, true);
				} catch (ex) {
					$.Modal.showError('页面刷新失败', ex);
				} finally {
					wx.stopPullDownRefresh();
				}
			}
		}
		
		// 调用小程序默认的Page函数进行页面初始化
		originPageFunction(page);
	};
	
	// 插入静态函数
	$(Page).extend(pageStaticFunctions);
	
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
