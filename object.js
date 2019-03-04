function weobj (o) {
	
	return {
		data: o,
		
		isEmpty(excludeFunction) {
			let isEmpty = true;
			this.each(() => isEmpty = false, excludeFunction);
			return isEmpty;
		},
		
		getValue(path) {
			let keys = path.split(".");
			let obj = o;
			for (let key of keys) {
				obj = obj[key];
				if (obj === undefined || obj === null)
					break;
			}
			return obj;
		},
		
		setValue(path, value) {
			let keys = path.split(".");
			let obj = o;
			for (let i = 0; i < keys.length - 1; ++i) {
				if (obj[keys[i]] === undefined || obj[keys[i]] === null)
					obj[keys[i]] = {};
				obj = obj[keys[i]];
			}
			obj[keys[keys.length - 1]] = value;
		},
		
		extend() {
			for (let i = 0; i < arguments.length; i++) {
				const source = arguments[i];
				if (source instanceof Array) {
					for (let item of source)
						this.extend(item);
				} else if (source instanceof Object)
					weobj(source).each((key, value) => {
						if (o[key] instanceof Object &&
							value instanceof Object &&
							!(o[key] instanceof Array) &&
							!(value instanceof Array))
							weobj(o[key]).extend(value);
						else
							o[key] = value;
					});
			}
			return this;
		},
		
		each(callback, excludeFunction) {
			if (!(o instanceof Object))
				return;
			if (o instanceof Array) {
				for (let i = 0; i < o.length; ++i)
					if (callback(i, o[i]) === false)
						break;
			}
			for (let key in o) {
				if (!o.hasOwnProperty(key))
					continue;
				if (excludeFunction && typeof o[key] === 'function')
					continue;
				if (callback(key, o[key]) === false)
					break;
			}
			return this;
		},
		
		map(callback) {
			if (!(o instanceof Object))
				return;
			let result = o instanceof Array ? [] : {};
			this.each((key, value) => {
				result[key] = callback(key, value);
				if (result[key] === undefined)
					delete result[key];
			});
			return result;
		},
		
		toPlainObject() {
			if (!(o instanceof Object))
				return o;
			if (o.toPlainObject)
				return o.toPlainObject();
			return this.map((key, value) => weobj(value).toPlainObject());
		},
		
		toTransferObject() {
			if (!(o instanceof Object))
				return o;
			if (o.toTransferObject)
				return undefined;
			return this.map((key, value) => weobj(value).toTransferObject());
		},
		
		toRichObject(typeDesc, key = null) {
			if (!(typeDesc instanceof Object))
				return o;
			if (o instanceof Array)
				return this.map((key, value) => weobj(value).toRichObject(typeDesc, key));
			if (typeDesc instanceof Function)
				return new typeDesc(o, key);
			let keyFound = {};
			let obj = this.map((key, value) => {
				let desc = typeDesc[key] ? typeDesc[key] : typeDesc['*'];
				let obj = weobj(value).toRichObject(desc instanceof Array ? desc[0] : desc, key);
				keyFound[key] = true;
				return obj;
			});
			$(typeDesc).each((key, desc) => {
				if (key === '*' || keyFound[key])
					return;
				if (!(desc instanceof Object))
					obj[key] = desc;
				else if (desc instanceof Array)
					obj[key] = desc[1];
			});
			return obj;
		}
		
	};
	
}

weobj.extend = function() {
	let o = {};
	for (let i = 0; i < arguments.length; i++)
		weobj(o).extend(arguments[i]);
	return o;
};

module.exports = weobj;