class _String {
	
	/**
	 * 将驼峰形式字符串转换为小写横杠形式字符串
	 *
	 * @param str 驼峰形式字符串
	 * @return {string} 小写横杠形式字符串
	 * @author Deng Nianchen
	 */
	static camelTolowerDash(str) {
		let temp = str.replace(/[A-Z]/g, match => "-" + match.toLowerCase());
		if (temp.slice(0, 1) === '_')
			temp = temp.slice(1);
		return temp;
	}
	
	/**
	 * 将小写横杠形式字符串转换为驼峰形式字符串
	 *
	 * @param str 小写横杠形式字符串
	 * @returns {string} 驼峰形式字符串
	 * @author Deng Nianchen
	 */
	static lowerDashToCamel(str) {
		return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
			return $1 + $2.toUpperCase();
		});
	}
	
	static toBoolean(str) {
		if (str === 'True' || str === 'true' || str === '1')
			return true;
		if (str === 'False' || str === 'false' || str === '0')
			return false;
		return null;
	}
	
	static toNumber(str) {
		let value = parseFloat(str);
		if (isNaN(value))
			return null;
		return value;
	}
	
	static toType(str, type) {
		switch (type) {
			case 'number': case 'Number': return this.toNumber(str);
			case 'boolean': case 'Boolean': return this.toBoolean(str);
			case 'string': case 'String': return str;
			default: return JSON.parse(str);
		}
	}
}

module.exports = _String;