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
	 * @param text {string} 提示内容
	 * @author Deng Nianchen
	 */
	static showSuccess(text) {
		wx.showToast({
			title: text,
			icon: 'success'
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
	 * @param {object} options 可以指定除title, content, success, fail之外的其他选项，参考微信API文档：wx.showModal
	 * @returns {Promise}
	 * @author Deng Nianchen
	 */
	static show(title, content, options = {}) {
		wx.hideToast();
		return new Promise((resolve, reject) => {
			wx.showModal($.extend(options, {
				title,
				content: !content ?
					'' :
					(content.constructor === String ?
						content :
						JSON.stringify(content)),
				success: res => resolve(res),
				fail: () => reject()
			}));
		});
	};
	
	/**
	 * 显示失败提示对话框
	 *
	 * @param title {string} 提示框标题
	 * @param ex {string|$.Err|*} 异常信息
	 * @returns {Promise}
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
		return Modal.show(title, errorMessage, { showCancel: false });
	};
	
}

module.exports = Modal;