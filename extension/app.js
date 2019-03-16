(function () {
	const originAppFunction = App;
	App = function(app) {
		app.initializeResolves = [];
		
		app.checkUpdate = async function () {
			return new Promise(resolve => {
				let updateManager = wx.getUpdateManager();
				updateManager.onCheckForUpdate(result => {
					if (!result.hasUpdate)
						resolve();
					else
						Page.current().setLoading("发现更新，正在下载");
				});
				updateManager.onUpdateFailed(async () => {
					await $.Modal.show('版本更新',
						'更新下载失败。非最新版本的小程序可能无法正常运行。重启小程序可重新尝试更新。', {
							showCancel: false
						});
					resolve();
				});
				updateManager.onUpdateReady(async () => {
					await $.Modal.show('版本更新',
						'更新已下载，点击确认完成更新并重启小程序。', {
						showCancel: false
					});
					Page.current().setLoading("正在安装更新");
					updateManager.applyUpdate();
				});
			});
		};
		
		app.waitForInitialize = async function () {
			let _this = this;
			if (!_this.initializing)
				return;
			return new Promise(resolve => {
				_this.initializeResolves.push (resolve);
			});
		};
		
		app._onLaunch = app.onLaunch;
		app.onLaunch = async function (option) {
			$.initial(this);
			try {
				this.initializing = true;
				// 1. 检查更新
				await this.checkUpdate();
				// 2. 调用onLaunch函数进行用户自定义初始化（若存在）
				if (app._onLaunch instanceof Function)
					await app._onLaunch(option);
				this.initializing = false;
				// 3. 若有方法在等待onLaunch执行完成，则通知它们继续执行
				for (let resolve of this.initializeResolves)
					resolve();
			} catch (ex) {
				this.initializing = false;
				Page.reLaunch({
					url: '/page/apperror/index',
					richData: { ex }
				})
			}
		};
		// 调用微信原始的App()构造函数
		originAppFunction(app);
	};
})();