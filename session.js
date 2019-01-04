const qcloud = require('wafer2-client-sdk');

class Session {
	
	/**
	 * 模块初始化函数
	 * 清除会话中的所有存储内容
	 *
	 * @protected
	 * @author Deng Nianchen
	 */
	static _initial() {
		qcloud.clearSession();
	}
	
	/**
	 * 从会话中获取指定名称的数据对象。若不存在，则返回undefined
	 *
	 * @param {String} key 数据的名称
	 * @returns {*}
	 * @author Deng Nianchen
	 */
	static get(key) {
		return Session._getSessionObject()[key];
	}
	
	/**
	 * 使用指定名称在会话中存储数据
	 *
	 * @param {String} key 数据的名称
	 * @param {*} value 数据对象
	 * @author Deng Nianchen
	 */
	static set(key, value) {
		let s = Session._getSessionObject();
		s[key] = value;
		Session._setSessionObject(s);
	}
	
	/**
	 * 从会话中删除指定名称的数据。若不存在，则不会删除任何数据。
	 *
	 * @param key 数据的名称
	 * @author Deng Nianchen
	 */
	static remove(key) {
		let s = Session._getSessionObject();
		delete s[key];
		Session._setSessionObject(s);
	}
	
	/**
	 * 调用qcloud sdk中的函数获取会话对象。若不存在，则返回空对象。
	 *
	 * @returns {*|{}}
	 * @private
	 * @author Deng Nianchen
	 */
	static _getSessionObject() {
		return qcloud.Session.get() || {};
	}
	
	/**
	 * 调用qcloud sdk中的函数设置会话对象
	 *
	 * @param {*} obj
	 * @private
	 * @author Deng Nianchen
	 */
	static _setSessionObject(obj) {
		qcloud.Session.set(obj);
	}
	
}

module.exports = Session;