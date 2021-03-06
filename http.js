const qcloud = require('wafer2-client-sdk');

/**
 * 主机地址
 * @type {String}
 */
let host = null;

/**
 * 所有请求方法若失败均返回通用错误对象$.Err
 *
 * @see $.Err
 */
class Http {
	
	/**
	 * 模块初始化函数
	 * 设置主机地址和登录地址
	 * 支持的配置字段如下：
	 * host: 可选，指定用于所有请求的主机地址，若未指定，则无法调用该模块的任何函数
	 *
	 * @param config 配置信息
	 * @protected
	 * @author Deng Nianchen
	 */
	static _initial(config) {
		if (!config.host)
			return;
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
		if (!host)
			throw $.Err.FAIL("$.Http is not initialized: host is not configured");
		return new Promise((resolve, reject) => {
			(withAuth ? qcloud.login : qcloud.loginWithCode)({
				success: res => resolve(res),
				fail: err => reject($.Err.LOGIN_FAIL(err.message))
			});
		});
	}
	
	/**
	 * qcloud.request方法的Promise封装，URL自动添加根路径，解析请求方法，自适应登录态/非登
	 * 录态。若成功则提供(data, result)，其中data为响应对象中的数据，result为原始响应对象。
	 * 若失败则提供ex，包含错误信息。
	 *
	 * @param {String}  urlWithMethod   包含请求方法的URL相对路径，格式为：[method] url。
	 *                                  若省略请求方法则默认为GET。
	 *                                  范例：
	 *                                  1. "PUT /user"
	 *                                  2. "/user"（等价于"GET /user"）
	 * @param {Object?} data            随请求提交的数据
	 * @param {Object?} options         请求选项，同request函数的options，但是忽略
	 *                                  url, method, data, success, fail五个选项
	 * @param {Class|Class[]?}  returnType      返回数据的类型，若未指定则返回原始数据
	 * @return {Promise}
	 * @see _handleResult
	 * @author Deng Nianchen
	 */
	static request(urlWithMethod, data, options, returnType) {
		if (!host)
			throw $.Err.FAIL("$.Http is not initialized: host is not configured");

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
				data: Http._handleRequestData(data),
				success: result => resolve(Http._handleResult(result, returnType)),
				fail: ex => reject($.Err.fromResponseError(ex))
			});
			if (method !== 'GET')
				$(requestOptions).extend({
					header: { 'content-type': 'application/x-www-form-urlencoded' }
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
	 * @param {Object}  e               表单提交事件
	 * @param {String?} urlWithMethod   包含请求方法的URL相对路径，见request函数。
	 *                                  未指定则默认为 /noop
	 * @param {Object?} data            随请求提交的数据
	 * @param {Object?} options         请求选项，见request函数
	 * @param {Class|Class[]?}  returnType      返回数据的类型，若未指定则返回原始数据
	 * @return {Promise}
	 * @author Deng Nianchen
	 * @see request
	 * @see _handleResult
	 */
	static submit(e, urlWithMethod, data, options, returnType) {
		if (!host)
			throw $.Err.FAIL("$.Http is not initialized: host is not configured");
		if (!e || !e.detail.formId)
			throw $.Err.FAIL("missing e or e.detail.formId");
		if (urlWithMethod === undefined)
			urlWithMethod = "/noop";
		return Http.request(urlWithMethod, data, $.extend(options, {
			header: { 'X-WX-Formid': e.detail.formId },
			login: true
		}), returnType);
	}
	
	/**
	 * 上传文件。该方法始终以登录态发起请求，并添加由submit事件提供的表单ID到请求头。
	 *
	 * @param {Object}  e           表单提交事件
	 * @param {String}  url         URL相对路径
	 * @param {String}  file        要上传的文件路径
	 * @param {String}  name        提供给服务器的文件名
	 * @param {Object?} data        随请求提交的数据
	 * @param {Object?} options     请求选项，见request函数
	 * @param {Class|Class[]?}  returnType  返回数据的类型，若未指定则返回原始数据
	 * @returns {Promise}
	 * @see request
	 * @see submit
	 * @see _handleResult
	 * @author Deng Nianchen
	 */
	static upload(e, url, file, name, data, options, returnType) {
		if (!host)
			throw $.Err.FAIL("$.Http is not initialized: host is not configured");
		if (!e || !e.detail.formId)
			throw $.Err.FAIL("missing e or e.detail.formId");
		return new Promise((resolve, reject) => {
			qcloud.upload($.extend(options, {
				url: `${host}${url}`,
				header: { 'X-WX-Formid': e.detail.formId },
				login: true,
				filePath: file,
				name: name,
				formData: Http._handleRequestData(data),
				success: result => resolve(Http._handleResult(result, returnType)),
				fail: ex => reject($.Err.fromResponseError(ex))
			}));
		});
	}
	
	/**
	 * 对请求数据进行预处理，将其中包含的模型对象转换为一般数据对象，然后进行JSON序列化。
	 *
	 * @param {object} data 请求数据
	 * @return {object} 处理后的请求数据
	 * @private
	 * @see $.Model.toTransferObject
	 * @author Deng Nianchen
	 */
	static _handleRequestData(data) {
		if (data === null)
			return data;
		let processedData = {};
		$(data).each((key, value) => {
			value = Http._handleRequestDataElement(value);
			if (value instanceof Object)
				value = JSON.stringify(value);
			if (data !== undefined)
				processedData[key] = value;
		}, true);
		return processedData;
	}
	
	/**
	 * 对请求数据中的元素进行预处理，判断是否为模型对象或其数组，并将其转为一般数据对象（数组）。
	 *
	 * @param {$.Model|$.Model[]|*} data    请求数据中的元素
	 * @return {object|object[]|*}  处理后的数据
	 * @see $.Model.toTransferObject
	 * @private
	 * @author Deng Nianchen
	 */
	static _handleRequestDataElement(data) {
		if (data instanceof $.Model)
			return data.toTransferObject();
		if (data instanceof Array)
			return data.map(value => Http._handleRequestDataElement(value));
		return data;
	}
	
	/**
	 * 对请求的响应数据进行类型转换。
	 *
	 * 若响应数据为数组，则对其中每一个元素进行类型转换。
	 *
	 * 若指定的数据类型为数组，则依次对响应数据中的元素进行的类型转换（此时响应数据必须为
	 * 数组类型）。若其中的元素仍为数组，则会对该数组中的每个元素都进行相应的类型转换。
	 *
	 * 若未指定返回类型，则返回原始响应数据。
	 *
	 * @param {object}          result  响应对象，包含响应数据
	 * @param {Class|Class[]}   type    返回数据的类型
	 * @returns {*} 处理后的数据
	 * @private
	 * @author Deng Nianchen
	 */
	static _handleResult(result, type) {
		let returnData = result.data.data;
		if (!type || returnData === null)
			return returnData;
		if (type instanceof Array) {
			if (!(returnData instanceof Array))
				throw $.Err.FAIL("Type is array but response data is not array");
			returnData = returnData.map(
				(value, index) => {
					return value === null ? null :
						value instanceof Array ? value.map(value1 => new type[index](value1)) :
							new type[index](value);
				});
		} else if (returnData instanceof Array) {
			returnData = returnData.map(
				(value) => value === null ? null : new type(value));
		} else
			returnData = new type(returnData);
		return returnData;
	}

}

module.exports = Http;