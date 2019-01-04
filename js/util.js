// 将 0-99 的数字转为字符串，前面补 0
var numToStr = function (num) {
	if (0 <= num && num < 10) {
		return '0' + num;
	} else {
		return '' + num;
	}
}