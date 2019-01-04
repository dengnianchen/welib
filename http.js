const qcloud = require('wafer2-client-sdk');

/**
 * 主机地址
 * @type {String}
 */
let host = '';

/**
 * 所有请求方法若失败均返回错误对象，该对象包含statusCode, type, message三个字段
 */
class Http {
	
	/**
	 * 模块初始化函数
	 * 设置主机地址和登录地址
	 * 支持的配置字段如下：
	 * host: 必选，指定用于所有请求的主机地址
	 *
	 * @param config 配置信息
	 * @protected
	 * @author Deng Nianchen
	 */
	static _initial(config) {
		if (!config.host)
			throw new Error("Failed to initialize module welib.HTTP: missing field 'host' in config");
		host = config.host;
		qcloud.setLoginUrl(`${host}/login`);
	}
	
	/**
	 * 以当前微信账号进行登录。
	 * 用户第一次使用小程序时需授权才可获得其微信账号信息，此时需设置参数withAuth=true，
	 * 且需要在 <button open-type="getUserInfo" bindgetuserinfo="..."></button>
	 * 的回调函数中调用。
	 * 详见： https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=&docid=0000a26e1aca6012e896a517556c01
	 *
	 * @param {boolean?} withAuth 是否以授权方式登录
	 * @returns {Promise}
	 * @author Deng Nianchen
	 */
	static login(withAuth) {
		return new Promise((resolve, reject) => {
			(withAuth ? qcloud.login : qcloud.loginWithCode)({
				success: res => resolve(res),
				fail: err => reject(err)
			});
		});
	}
	
	/**
	 * qcloud.request方法的Promise封装，URL自动添加根路径，解析请求方法，自适应登录态/非登
	 * 录态。若成功则提供(data, result)，其中data为响应对象中的数据，result为原始响应对象。
	 * 若失败则提供ex，包含错误信息。
	 *
	 * @param {String}  urlWithMethod 包含请求方法的URL相对路径，格式为：[method] url。
	 *                                若省略请求方法则默认为GET。
	 *                                范例："PUT /user", "/user" = "GET /user"
	 * @param {Object?} data          随请求提交的数据
	 * @param {Object?} options       请求选项，同request函数的options，但是忽略
	 *                                url, method, data, success, fail五个选项
	 * @return {Promise}
	 * @author Deng Nianchen
	 */
	static request(urlWithMethod, data, options) {
		
		// 1. 将urlWithMethod拆分为method和relativeUrl
		const splitPosition = urlWithMethod.indexOf(' ');
		const method = splitPosition === -1 ? 'GET' :
			urlWithMethod.substr(0, splitPosition);
		const relativeUrl = urlWithMethod.substr(splitPosition + 1);
		
		// 2. 若选项指定需要登录后访问或当前已存在登录会话，则设置该请求为登陆态请求
		let requestWithLogin = false;
		if (options && options.login)
			requestWithLogin = true;
		else if ($.Session.get('skey'))
			requestWithLogin = true;
		
		return new Promise((resolve, reject) => {
			// 3. 组合所有选项
			const requestOptions = $.extend(options, {
				url: `${host}${relativeUrl}`,
				method: method,
				login: requestWithLogin,
				data: data,
				success: result => resolve(result.data.data, result),
				fail: ex => reject(ex)
			});
			// 4. 发起请求并处理响应结果
			qcloud.request(requestOptions);
		});
	}
	
	/**
	 * 基本功能和request函数一致，提交请求时将包含由submit事件提供的表单ID到请求头。
	 * 该方法始终以登陆态发起请求。
	 * 注：仅在访问受限的资源路径（需要登陆才能访问的路径）时表单ID才会被后台收集。
	 *
	 * @param {Object}  e             表单提交事件
	 * @param {String?} urlWithMethod 包含请求方法的URL相对路径，见request函数。未指定则
	 *                                默认为 /noop
	 * @param {Object?} data          随请求提交的数据
	 * @param {Object?} options       请求选项，见request函数
	 * @return {Promise}
	 * @author Deng Nianchen
	 * @see request
	 */
	static submit(e, urlWithMethod, data, options) {
		if (!e || !e.detail.formId)
			throw new Error("missing e or e.detail.formId");
		if (urlWithMethod === undefined)
			urlWithMethod = "/noop";
		return request(urlWithMethod, data, $.extend(options, {
			header: $.extend({ 'X-WX-Formid': e.detail.formId },
				options ? options.header : null),
			login: true
		}));
	}
	
	/**
	 * 上传文件。该方法始终以登录态发起请求，并添加由submit事件提供的表单ID到请求头。
	 *
	 * @param {Object}  e       表单提交事件
	 * @param {String}  url     URL相对路径
	 * @param {String}  file    要上传的文件路径
	 * @param {String}  name    提供给服务器的文件名
	 * @param {Object?} data    随请求提交的数据
	 * @param {Object?} options 请求选项，见request函数
	 * @returns {Promise}
	 * @see request
	 * @see submit
	 * @author Deng Nianchen
	 */
	static upload(e, url, file, name, data, options) {
		if (!e || !e.detail.formId)
			throw new Error("missing e or e.detail.formId");
		return new Promise((resolve, reject) => {
			qcloud.upload($.extend(options, {
				url: `${host}${url}`,
				header: $.extend({ 'X-WX-Formid': e.detail.formId },
					options ? options.header : null),
				login: true,
				filePath: file,
				name: name,
				formData: data,
				success: result => {
					resolve(result.data.data, result)
				},
				fail: ex => reject(ex)
			}));
		});
	}

}

module.exports = Http;