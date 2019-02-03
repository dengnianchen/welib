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
	 * @param title {string} 提示框标题
	 * @param content {string} 提示框内容
	 * @returns {Promise}
	 * @author Deng Nianchen
	 */
	static show(title, content) {
		wx.hideToast();
		return new Promise((resolve, reject) => {
			wx.showModal({
				title,
				content: !content ?
					'' :
					(content.constructor === String ?
						content :
						JSON.stringify(content)),
				showCancel: false,
				success: res => resolve(res),
				fail: () => reject
			})
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
		return Modal.show(title, errorMessage);
	};
	
}

module.exports = Modal;