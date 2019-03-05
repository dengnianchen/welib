class AppAlias {
	
	static _initial() {
		// 向全局对象中插入捷径属性
		$.__defineGetter__('App', () => getApp());
		$.__defineGetter__('AppData', () => getApp().globalData);
		if (!getApp().globalData)
			getApp().globalData = {};
	}
	
}

module.exports = AppAlias;