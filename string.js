class _String {
	
	/**
	 * 将驼峰形式字符串转换为小写横杠形式字符串
	 *
	 * @param str 驼峰形式字符串
	 * @return {String} 小写横杠形式字符串
	 * @author Deng Nianchen
	 */
	static camelTolowerDash(str) {
		let temp = str.replace(/[A-Z]/g, match => "-" + match.toLowerCase());
		if (temp.slice(0, 1) === '_')
			temp = temp.slice(1);
		return temp;
	}
	
}

module.exports = _String;