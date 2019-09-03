class Wui {
	
	/**
	 * 模块初始化函数
	 * 传入各Wui组件的配置数据
	 * 支持的配置字段如下：
	 * wui: 可选，包含各Wui组件的配置（wui.组件名.配置项）
	 *
	 * @param config 配置信息
	 * @protected
	 * @author Deng Nianchen
	 */
	static _initial(config) {
		if (config.wui)
			Wui.config = config.wui;
		else
			Wui.config = {};
	}
	
	static applyStyle(stringFormatStyle, defaultStyle) {
		try {
			stringFormatStyle = stringFormatStyle.replace(';', ',').
				replace(/([A-Za-z0-9\-]+):([^,]+)/g, function($0, $1, $2) {
					return `"${$.String.lowerDashToCamel($1)}":"${$2}"`;
				});
			let wuiStyleObject = JSON.parse("{" + stringFormatStyle + "}");
			let mergedStyle = {};
			for (let key in defaultStyle) {
				if (!defaultStyle.hasOwnProperty(key))
					continue;
				if (wuiStyleObject.hasOwnProperty(key)) {
					let value = $.String.toType(wuiStyleObject[key],
						typeof (defaultStyle[key]));
					mergedStyle[key] = value !== null && !isNaN(value)
						? value
						: defaultStyle[key];
				} else
					mergedStyle[key] = defaultStyle[key];
			}
			return mergedStyle;
		} catch (ex) {
			console.log(ex);
			return defaultStyle;
		}
	}
}

module.exports = Wui;