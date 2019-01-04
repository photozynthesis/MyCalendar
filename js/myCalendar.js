// 当前月中的日，变化时更新日期
var currentDate = 1;

// 用于显示日期数据的 date 对象
var date;

// 存储记事的 json 对象
var notes = {};

window.onload = function () {
	date = new Date();
	// 显示下方日期
	document.getElementById('_panelItem').innerHTML = date.getFullYear() + '-' + numToStr(date.getMonth() + 1);
	// 显示表格
	printTable(document.getElementsByClassName('_dateValue'), getTableData(date));
	// 绑定日期点击事件
	for (var element of document.getElementsByClassName('_dateValue')) {
		element.onclick = startNote;
	}
	// 让时钟走
	setInterval('setTime()', 1000);
};

// 更新当前页的记事状态
var updateNoteStatus = function () {
	for (var element of document.getElementsByClassName('_dateValue')) {
		var noteKey = date.getFullYear() + '-' + numToStr(date.getMonth() + 1) + '-' + element.innerHTML;
		if (notes.hasOwnProperty(noteKey)) {
			element.style.backgroundColor = '#ea9999';
		} else {
			element.style.backgroundColor = null;
		}
	}
}

// 日期的点击事件（记事）
var startNote = function () {
	if (this.innerHTML == '--') {
		return;
	}
	var noteKey = date.getFullYear() + '-' + numToStr(date.getMonth() + 1) + '-' + this.innerHTML;
	var noteValue = notes[noteKey];
	if (noteValue == undefined || noteValue == null) {
		noteValue = prompt(noteKey + ' 记事：');
	} else {
		noteValue = prompt(noteKey + ' 记事：', noteValue);
	}
	if (noteValue == undefined || noteValue == null || noteValue.length == 0) {
		return;
	}
	notes[noteKey] = noteValue;
	// 显示记事日期
	updateNoteStatus();
}

// 更新日期表格（翻页）
var updateDateTable = function (offset) {
	date.setMonth(date.getMonth() + offset);
	// 显示下方日期
	document.getElementById('_panelItem').innerHTML = date.getFullYear() + '-' + numToStr(date.getMonth() + 1);
	// 显示表格
	printTable(document.getElementsByClassName('_dateValue'), getTableData(date));
	// 显示记事日期
	updateNoteStatus();
}

// 设置当前时钟和日期
var setTime = function () {
	var date = new Date();
	var timeStr = numToStr(date.getHours()) + ':' + numToStr(date.getMinutes()) + ':' + numToStr(date.getSeconds());
	document.getElementById('_time').innerHTML = timeStr;
	if (date.getDate() != currentDate) {
		currentDate = date.getDate();
		var dateStr = date.getFullYear() + '-' + numToStr(date.getMonth() + 1) + '-' + numToStr(date.getDate());
		document.getElementById('_date').innerHTML = dateStr;
	}
}

// 根据日期获得表格数据
var getTableData = function (date) {
	var fullYear = date.getFullYear();
	var month = date.getMonth() + 1;
	var daysInMonth;
	switch (month) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			// 31 天
			daysInMonth = 31;
			break;
		case 4:
		case 6:
		case 9:
		case 11:
			// 30 天
			daysInMonth = 30;
			break;
		case 2:
			// 28/29 天
			if (fullYear % 4 == 0 && fullYear % 100 != 0 || fullYear % 400 == 0) {
				daysInMonth = 29;
			} else {
				daysInMonth = 28;
			}
			break;
	}
	// 本月第一天的星期（以中国的格式）
	var tempDate = new Date(date.getTime());
	tempDate.setDate(1);
	var firstDayInWeek = tempDate.getDay();
	if (firstDayInWeek == 0) {
		firstDayInWeek = 6;
	} else {
		firstDayInWeek--;
	}
	// 目标数组
	var tableData = [[], [], [], [], [], []];
	if (daysInMonth == 28 && firstDayInWeek == 0) {
		// 有四行的情况
		var dayIndex = 1;
		for (let i = 0; i < 6; i++) {
			// 首尾行置空
			if (i == 0 || i == 5) {
				for (let j = 0; j < 7; j++) {
					tableData[i][j] = '--';
				}
			} else {
				for (let j = 0; j < 7; j++) {
					tableData[i][j] = dayIndex;
					dayIndex++;
				}
			}
		}
	} else {
		// 其余情况从首行开始拼接
		var dayIndex = 1;
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 7; j++) {
				if (i == 0) {
					// 首行
					if (j < firstDayInWeek) {
						tableData[i][j] = '--';
					} else {
						tableData[i][j] = dayIndex;
						dayIndex++;
					}
				} else {
					// 其他行
					if (dayIndex > daysInMonth) {
						tableData[i][j] = '--';
					} else {
						tableData[i][j] = dayIndex;
						dayIndex++;
					}
				}
			}
		}
	}
	return tableData;
}

// 通过表格 element 数组和表格表格数据源，显示数据
var printTable = function (tableItems, tableData) {
	for (var i in tableData) {
		for (var j in tableData[i]) {
			var index = 7 * parseInt(i) + parseInt(j);
			tableItems[index].innerHTML = tableData[i][j];
		}
	}
}
