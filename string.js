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
	
}

module.exports = _String;