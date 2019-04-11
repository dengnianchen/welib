class Modal {

	/**
	 * 显示繁忙提示
	 *
	 * @param text {string} 提示内容
	 * @author Deng Nianchen
	 */
	static showBusy(text) {
		wx.showToast({
			title: text,
			icon: 'loading',
			duration: 100000,
			mask: true
		});
	}

	/**
	 * 显示成功提示
	 *
	 * @param {string}  text        提示内容
	 * @param {number}  duration    显示持续时长
	 * @return Promise<void>
	 * @author Deng Nianchen
	 */
	static async showSuccess(text, duration = 1500) {
		return new Promise ((resolve, reject) => {
			wx.showToast({
				title: text,
				icon: 'success',
				duration: duration,
				success: () => setTimeout(resolve, duration),
				fail: reject
			});
		});
	}

	/**
	 * 隐藏提示框
	 *
	 * @author Deng Nianchen
	 */
	static hideToast() {
		wx.hideToast();
	}

	/**
	 * 显示提示对话框
	 *
	 * @param {string} title 提示框标题
	 * @param {string} content 提示框内容
	 * @param {object} options { cancelBtn, confirmBtn }，详见Wui-Dialog组件的属性
	 *
	 * @returns {Promise<boolean>}
	 * @author Deng Nianchen
	 */
	static async show(title, content, options = {}) {
		wx.hideToast();
		try {
			return await $.Wui.Dialog.show($.extend(options, { title, content }));
		} catch (ex) {
			let wxModalOptions = {};
			wxModalOptions.title = title;
			wxModalOptions.content = content;
			wxModalOptions.showCancel = options.cancelBtn;
			wxModalOptions.cancelText = options.cancelBtn;
			wxModalOptions.showConfirm = options.confirmBtn;
			wxModalOptions.confirmText = options.confirmBtn;
			return new Promise((resolve, reject) => {
				wx.showModal($.extend(wxModalOptions, {
					success: res => res.confirm ? resolve(true) : resolve(false),
					fail: reject
				}));
			});
		}
	};
	
	/**
	 * 显示失败提示对话框
	 *
	 * @param title {string} 提示框标题
	 * @param ex {string|$.Err|*} 异常信息
	 *
	 * @returns {Promise<boolean>}
	 * @author Deng Nianchen
	 */
	static showError(title, ex) {
		console.error(title, ex);
		let errorMessage;
		if (ex instanceof String)
			errorMessage = ex;
		else if (ex.message)
			errorMessage = ex.message;
		else if (ex.brief)
			errorMessage = ex.brief;
		else
			errorMessage = ex.toString();
		return Modal.show(title, errorMessage);
	};
	
}

module.exports = Modal;