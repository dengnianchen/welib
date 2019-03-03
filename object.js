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
						if (o[key] instanceof Object && value instanceof Object)
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
			this.each((key, value) => result[key] = callback(key, value));
		},
		
		toPlainObject() {
			if (!(o instanceof Object))
				return o;
			if (o.toPlainObject())
				return o.toPlainObject();
			return this.map((key, value) => weobj(value).toPlainObject());
		},
		
		fromPlainObject(typeDesc) {
			if (!(o instanceof Object) || !typeDesc)
				return o;
			if (typeDesc instanceof Function) {
				if (o instanceof Array)
					return this.map((key, value) => new typeDesc(value));
				else
					return new typeDesc(o);
			}
			return this.map((key, value) => weobj(value).fromPlainObject(typeDesc[key]));
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