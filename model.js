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
	 * @param {object}  data    一般数据对象
	 * @author Deng Nianchen
	 */
	constructor(data = null) {
		if (!data)
			$(this).extend(data);
	}
	
	/**
	 * 将模型对象转换为可传递给服务器的一般数据对象
	 *
	 * @return {object}
	 * @author Deng Nianchen
	 */
	toPlainObject() {
		let plainObject = {};
		$(this).each((key, value) => {
			if (!(value instanceof Model))
				plainObject[key] = value;
		});
		return plainObject;
	}
	
}

module.exports = Model;