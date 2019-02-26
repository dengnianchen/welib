class Url {
	
	static toParams(obj) {
		if (!(obj instanceof Object))
			throw $.Err.FAIL('Url.toParams：参数不是Object类型');
		let params = {};
		$(obj).each((key, value) => {
			if (value instanceof Object)
				params[key] = JSON.stringify(value);
			else
				params[key] = value;
			params[key] = encodeURIComponent(params[key]);
		}, true);
		return params;
	}
	
	static toParamString(obj) {
		if (!(obj instanceof Object))
			throw $.Err.FAIL('Url.toParams：参数不是Object类型');
		let params = Url.toParams(obj);
		let paramStrings = [];
		$(params).each((key, value) => paramStrings.push(`${key}=${value}`));
		return paramStrings.join('&');
	}
	
	static fromParamString(str) {
		if (!str)
			return null;
		let paramStrings = str.split('&');
		let params = {};
		for (let s of paramStrings) {
			let p = s.indexOf('=');
			params[s.substr(0, p)] = s.substr(p + 1);
		}
		return Url.fromParams(params);
	}
	
	static fromParams(params) {
		if (!(params instanceof Object))
			return params;
		let obj = {};
		$(params).each((key, value) => {
			value = decodeURIComponent(value);
			try {
				obj[key] = JSON.parse(value);
			} catch (ex) {
				obj[key] = value;
			}
		});
		return obj;
	}
}

module.exports = Url;