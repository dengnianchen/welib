async function pageOnLoad() {
	
	// 1. 执行公共页面加载前操作
	if ($.App.beforePageLoad instanceof Function) {
		let r = await $.App.beforePageLoad(this);
		if (r === false)
			return false;
	}
	
	// 2. 设置全局配置
	this.setData({ '$': $.AppData });
	
	// 3. 调用用户定义的onLoad函数（若存在）进行页面加载
	if (this._onLoad instanceof Function) {
		let r = await this._onLoad(this.loadOptions);
		if (r === false)
			return false;
	}
	
}

async function pageOnShow() {
	
	// 1. 处理DialogPage的返回值（从Dialog页面返回时不执行具体的onShow操作）
	if (this.dialogPageResolve) {
		let dialogPageResolve = this.dialogPageResolve;
		this.dialogPageResolve = null;
		dialogPageResolve(Page.pullData('dialogResult'));
		return false;
	}
	
	// 2. 调用用户定义的onShow函数（若存在）进行页面加载
	if (this._onShow instanceof Function) {
		let r = await this._onShow();
		if (r === false)
			return false;
	}
	
}

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
		if (!$(this.rawOptions).isEmpty())
			path += '?' + $.Url.toParamString(this.rawOptions);
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
	async reloadPage(isPulldownRefresh = false) {
		let _this = this;
		if (App.chainRuning)
			return;
		try {
			if (!isPulldownRefresh)
				this.setLoading(true);
			this.callChain.push(async () => await pageOnLoad(_this));
			this.callChain.push(async () => await pageOnShow(_this));
			await this.runChain();
			if (!isPulldownRefresh)
				this.setLoading(false);
		} catch (ex) {
			if (!isPulldownRefresh)
				this.setLoading(false, ex);
			else
				throw ex;
		}
	},
	
	async runChain() {
		await $.App.waitForInitialize();
		let callChain = this.callChain;
		this.callChain = [];
		this.chainRuning = true;
		try {
			for (let func of callChain) {
				let r = await func();
				if (r === false)
					break;
			}
		} catch (ex) {
			throw ex;
		} finally {
			this.chainRuning = false;
		}
	}
	
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
	async reLaunch(option = {}) {
		if (option.data) {
			if (option.url.indexOf('?') >= 0)
				option.url += '&' + $.Url.toParamString(option.data);
			else
				option.url += '?' + $.Url.toParamString(option.data);
		}
		if (option.richData)
			Page.pushData('richData', option.richData);
		return new Promise (((resolve, reject) => {
			wx.reLaunch($.extend(option, {
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
		if (option.richData)
			Page.pushData('richData', option.richData);
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
		if (option.richData)
			Page.pushData('richData', option.richData);
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
 * 包装微信小程序默认的Page函数，可以在小程序对页面初始化前进行一些额外的公共操作
 *
 * @author Deng Nianchen
 */
(function () {
	
	const originPageFunction = Page;
	Page = function(page) {
		page.callChain = [];
		// 添加页面数据loading=true，用于显示“加载中”提示画面
		page.data = $.extend(page.data, { loading: true });
		// 插入工具函数
		$(page).extend(pageUtils);
		
		// 包装onLoad函数，进行加载时的通用操作
		page._onLoad = page.onLoad;
		page.onLoad = function(options) {
			let _this = this;
			_this.rawOptions = options;
			_this.loadOptions = $.extend(Page.pullData('richData'), $.Url.fromParams(options));
			_this.callChain.push(async () => pageOnLoad.call(_this));
		};
		
		// 包装onShow函数，若当前页面正在加载（onLoad正在执行）则onShow函数将在页面
		// 加载完成后调用
		page._onShow = page.onShow;
		page.onShow = async function() {
			let _this = this;
			_this.setLoading(true);
			_this.callChain.push(async () => pageOnShow.call(_this));
			try {
				await _this.runChain();
				_this.setLoading(false);
			} catch (ex) {
				_this.setLoading(false, ex);
			}
		};
		
		// 若页面没有实现onPullDownRefresh函数，则为其实现默认逻辑为刷新整个页面的内容
		if (!page.onPullDownRefresh) {
			page.onPullDownRefresh = async function() {
				if (this.chainRuning || this.data.loadingError) {
					wx.stopPullDownRefresh();
					return;
				}
				try {
					await this.reloadPage(true);
				} catch (ex) {
					$.Modal.showError('页面刷新失败', ex);
				}
				wx.stopPullDownRefresh();
			}
		}
		
		// 调用小程序默认的Page函数进行页面初始化
		originPageFunction(page);
	};
	
	// 插入静态函数
	$(Page).extend(pageStaticFunctions);
	
})();