/**
 * Sys类封装了微信系统信息有关的属性和辅助函数。
 */
class Sys {
	
	/**
	 * 获取微信小程序的系统信息对象
	 *
	 * @returns {*}
	 * @author Deng Nianchen
	 */
	static get info() {
		return wx.getSystemInfoSync();
	}
	
	/**
	 * 将rpx单位下的数值转换为px单位下的数值
	 *
	 * @param rpx rpx单位下的数值
	 * @returns {number} px单位下的数值
	 * @author Deng Nianchen
	 */
	static rpx2px(rpx) {
		return rpx / 750 * Sys.info.windowWidth;
	}
	
	/**
	 * 将px单位下的数值转换为rpx单位下的数值
	 *
	 * @param px px单位下的数值
	 * @returns {number} rpx单位下的数值
	 * @author Deng Nianchen
	 */
	static px2rpx(px) {
		return px / Sys.info.windowWidth * 750;
	}
	
	/**
	 * 获取px单位下的屏幕尺寸
	 *
	 * @returns {{x: number, y: number}}
	 * @author Deng Nianchen
	 */
	static get screenSizePx() {
		return {
			x: Sys.info.windowWidth,
			y: Sys.info.windowHeight
		};
	}
	
	/**
	 * 获取rpx单位下的屏幕尺寸
	 *
	 * @returns {{x: number, y: number}}
	 * @author Deng Nianchen
	 */
	static get screenSizeRpx() {
		return {
			x: Sys.px2rpx(Sys.info.windowWidth),
			y: Sys.px2rpx(Sys.info.windowHeight)
		};
	}
	
}

module.exports = Sys;