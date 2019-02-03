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
	
}

module.exports = Wui;