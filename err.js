class Err extends Error {
	
	/**
	 * 模块初始化函数
	 *
	 * @param config 配置信息
	 * @protected
	 * @author Deng Nianchen
	 */
	static _initial(config) {
		// 预处理错误类型，将错误类型标识符对应的错误类型描述转换为获取相应错误对象的函数
		// 使用时可以直接通过Err.错误类型标识符(错误信息)获取错误对象
		$(Err).each((key, value) => {
			Err[key] = (...params) => new Err(key, value, params);
		});
	}
	
	/**
	 *
	 * @param error
	 * @returns {*}
	 * @author Deng Nianchen
	 */
	static fromResponseError(error) {
		let err;
		if (Err[error.type])
			err = Err[error.type](error.message);
		else
			err = new Err(error.type, error.type, error.message);
		err.statusCode = error.statusCode;
		return err;
	}
	
	/**
	 * 构造函数，创建Err对象。
	 *
	 * 请使用对应的错误类型标识符函数创建Err对象，例如Err.REQUEST(message)可以创建错误
	 * 类型为REQUEST的Err对象。
	 *
	 * @param type 错误类型标识符
	 * @param brief 错误类型描述
	 * @param params 其他参数，常用的有message（错误详细信息）
	 * @protected
	 * @author Deng Nianchen
	 */
	constructor(type, brief, ...params) {
		super(...params);
		
		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, Err);
		}
		
		this.type = type;
		this.brief = brief;
	}
	
}

// 内置错误类型

/* 通用错误类型 */
Err.UNKNOWN = '欧，不知道哪里出错啦！';
Err.FAIL = '系统错误';
Err.REQUEST_ERROR = '网络貌似不太给力哦！';
Err.INVALID_RESPONSE_FORMAT = '无效的响应格式。';

/* 登录相关 */
Err.LOGIN_FAIL = '登录失败啦！';
Err.NEED_LOGIN = '只有登录用户才能看哦，快去登录吧！';

/* 请求参数错误 */
Err.MISSING_PARAM = '缺少必须的请求参数。';
Err.INVALID_PARAM = '请求中包含无效参数。';
Err.DUPLICATE_SUBMIT = '不可重复执行该提交请求。';
Err.INVALID_FILE = '上传的文件不符合要求。';
Err.NO_RESOURCE = '找不到您想看的东西哦！';

/* 系统内部错误 */
Err.INTERNAL_EXCEPTION = '哎哟，服务器出错啦！';
Err.DB_EXCEPTION = '执行数据库操作时发生异常。';
Err.NOT_IMPLEMENTED = '该方法尚未实现。';

module.exports = Err;