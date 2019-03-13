(function () {
	const originAppFunction = App;
	App = function(app) {
		app.initializeResolves = [];
		
		app.checkUpdate = async function () {
			await $.Modal.show('检查更新', '发现更新，点击确认开始更新');
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