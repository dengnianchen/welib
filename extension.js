/* extension.js 包含对原生类和对象的扩展 */

// 微信小程序的Promise类不含有finally函数
// 因此需自行实现该函数并插入Promise类的原型中
if (!Promise.prototype.finally) {
	Promise.prototype.finally = function(fn) {
		let finFn = () => fn.call(null);
		this.then(finFn, finFn);
		return this;
	};
}