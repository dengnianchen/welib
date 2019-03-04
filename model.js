/**
 * Model类用以抽象业务相关模型，提供帮助客户端-服务器通信的通用方法。
 *
 * @abstract
 * @author Deng Nianchen
 */
class Model {
	
	/**
	 * 从服务器返回的一般数据对象转换为模型对象
	 *
	 * @param {object}  data        一般数据对象
	 * @param {object}  typeDesc    类型结构描述
	 * @author Deng Nianchen
	 */
	constructor(data = null, typeDesc = {}) {
		$(this).extend($(data).toRichObject(typeDesc));
	}
	
	/**
	 * 将模型对象转换为可存储的一般数据对象
	 *
	 * @return {object}
	 * @author Deng Nianchen
	 */
	toPlainObject() {
		let plainObject = {};
		$(this).each((key, value) => {
			if (!(value instanceof Model))
				plainObject[key] = value;
			else
				plainObject[key] = value.toPlainObject();
		});
		return plainObject;
	}
	
	/**
	 * 将模型对象转换为可传递给服务器的一般数据对象（默认忽略Model字段）
	 *
	 * @return {object}
	 * @author Deng Nianchen
	 */
	toTransferObject() {
		let plainObject = {};
		$(this).each((key, value) => {
			if (!(value instanceof Model))
				plainObject[key] = value;
		});
		return plainObject;
	}
	
	/**
	 * 辅助函数，根据参数类型判断返回参数的id字段或参数本身
	 *
	 * @param {Array|Object|string|number} objOrId 含有id字段的对象/对象数组/id字段
	 * @return {string|number|string[]|number[]}
	 */
	static id(objOrId) {
		if (objOrId instanceof Array)
			return objOrId.map(value => Model.id(value));
		if (objOrId instanceof Object)
			return objOrId.id;
		return objOrId;
	}
}

module.exports = Model;