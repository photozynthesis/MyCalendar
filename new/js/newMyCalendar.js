let MyCalendar = (function () {

    // --- Controller - 控制器 ---
    // 日历：时间/日期显示控制器
    let calendarViewTimeManager = {
        timeStr: null,
        dateStr: null,
        timeElements: [],
        dateElements: [],
        day: null,
        loopSetDate: function () {
            window.setInterval(()=>{
                let date = new Date();
                calendarViewTimeManager.timeStr = utils.parseTwoDigitsStr(date.getHours()) + ':' + utils.parseTwoDigitsStr(date.getMinutes()) + ':' + utils.parseTwoDigitsStr(date.getSeconds());
                if (calendarViewTimeManager.day !== date.getDate()) {
                    calendarViewTimeManager.day = date.getDate();
                    calendarViewTimeManager.dateStr = date.getFullYear() + '-' + utils.parseTwoDigitsStr(date.getMonth() + 1) + '-' + utils.parseTwoDigitsStr(date.getDate());
                }
            }, 1000);
        },
        // 启动入口
        start: function () {
            // 监控时间字符串变量，在改变时修改 dom
            Object.defineProperty(calendarViewTimeManager, 'timeStr', {
                // get: function () {
                //     return calendarViewTimeManager.timeStr;
                // },
                set: function (timeStr) {
                    for (let timeElement of calendarViewTimeManager.timeElements) {
                        timeElement.innerHTML = timeStr;
                        // calendarViewTimeManager.timeStr = timeStr;
                    }
                }
            });
            // 监控日期字符串变量，在改变时修改 dom
            Object.defineProperty(calendarViewTimeManager, 'dateStr', {
                // get: function () {
                //     return calendarViewTimeManager.dateStr;
                // },
                set: function (dateStr) {
                    for (let dateElement of calendarViewTimeManager.dateElements) {
                        dateElement.innerHTML = dateStr;
                    }
                }
            });
            // 设置元素数组，启动循环
            let timeEles = document.getElementsByClassName('myCalendar_currentTime');
            let dateEles = document.getElementsByClassName('myCalendar_currentDate');
            if (timeEles.length !== 0) {
                this.timeElements = timeEles;
                this.dateElements = dateEles;
                this.loopSetDate();
            }
        }
    };

    // 工具集合
    let utils = {
        // 一些常量
        monthsOf31DaysArr: [1, 3, 5, 7, 8, 10, 12],
        monthsOf30DaysArr: [4, 6, 9, 11],

        // 将一位数字转为两位数字符串，其他数字直接原样返回
        parseTwoDigitsStr: function (num) {
            if (0 <= num && num <= 9) {
                return '0' + num;
            } else {
                return num;
            }
        },
        // 根据日期获得表格数据
        getTableData: function (date) {
            let tableData = [[], [], [], [], [], []];
            let fullYear = date.getFullYear();
            let month = date.getMonth() + 1;
            let daysInMonth;
            if (this.monthsOf31DaysArr.indexOf(month) !== -1) {
                daysInMonth = 31;
            } else if (this.monthsOf30DaysArr.indexOf(month) !== -1) {
                daysInMonth = 30;
            } else {
                if (fullYear % 4 === 0 && fullYear % 100 !== 0 || fullYear % 400 === 0) {
                    daysInMonth = 29;
                } else {
                    daysInMonth = 28;
                }
            }
            // 本月第一天的星期（以中国的格式）
            let tempDate = new Date(date.getTime());
            tempDate.setDate(1);
            let firstDayInWeek = tempDate.getDay();
            if (firstDayInWeek === 0) {
                firstDayInWeek = 6;
            } else {
                firstDayInWeek--;
            }
            if (daysInMonth === 28 && firstDayInWeek === 0) {
                // 有四行的情况
                let dayIndex = 1;
                for (let i = 0; i < 6; i++) {
                    // 首尾行置空
                    if (i === 0 || i === 5) {
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
                let dayIndex = 1;
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 7; j++) {
                        if (i === 0) {
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
        },
        // 根据 date 获取 yyyy-MM 格式的字符串
        getDateStr: function (date) {
            return date.getFullYear() + '-' + this.parseTwoDigitsStr(date.getMonth() + 1);
        }
    };

    // 获取当前实例计数
    let getNextCount = function() {
        return CalendarModel.prototype.count ++;
    };

    // 启动日历，获取用户指定的元素，绑定日历实例
    let bind = function (data) {
        // 获取选择的元素，创建日历对象
        for (let selectorStr of data.selectors) {
            let eles = document.querySelectorAll(selectorStr);
            for (let ele of eles) {
                let newCalendarInstance = new CalendarModel(ele);
            }
        }
        // 通过 时间/日期渲染管理器渲染时间
        calendarViewTimeManager.start();
    };

    // --- Model - 定义日历实例模型 ---
    class CalendarModel{
        constructor(ele) {
            // 当前实例的挂载点
            this.mountPoint = ele;

            // 部分 id 和 class
            this.id_currentTime = null;
            this.id_currentDate = null;
            this.id_panelButton_prev = null;
            this.id_panelItem = null;
            this.id_panelButton_next = null;
            this.class_tableValue = null;

            // 用于日历表格的 date
            this.date = new Date();
            // this.dateTableData = [[], [], [], [], [], []];
            this.notes = {};
            this.panelItemStr = '-------';

            // --- 以下为初始化工作 ---
            // 设置当前实例的 id 和 class(用于设置值)
            this.setIdAndClass();

            // 设置当前模型的 dom
            this.domStr = this.getCalendarDomStr();

            // 挂载 dom 到页面
            this.mountPoint.innerHTML = this.domStr;

            // 初始显示日历表格
            this.showCalendarByOffset(0);

            // 给当前实例的按钮绑定事件
            this.setOnClickEvents();
        }

        // 给当前实例的按钮绑定事件
        setOnClickEvents() {
            // 翻页按钮
            document.getElementById(this.id_panelButton_prev).onclick = ()=>{this.showCalendarByOffset(-1)};
            document.getElementById(this.id_panelButton_next).onclick = ()=>{this.showCalendarByOffset(1)};
            // 日期按钮
        }

        // 通过月份偏移量，显示当前实例日历表格
        showCalendarByOffset(offset) {
            this.date.setMonth(this.date.getMonth() + offset);
            this.printDateStr(this.date);
            this.printTable(utils.getTableData(this.date));
        }

        // 通过当前 date，显示日历区域的日期字符串
        printDateStr(date) {
            document.getElementById(this.id_panelItem).innerHTML = '<b>' + utils.getDateStr(date) + '</b>';
        }

        // 通过日期数据，打印当前实例的日历表格
        printTable(tableData) {
            const cells = document.getElementsByClassName(this.class_tableValue);
            let index = 0;
            for (let i in tableData) {
                for (let data of tableData[i]) {
                    cells[index++].innerHTML = data;
                }
            }
        }

        // 设置当前实例的 id 和 class
        setIdAndClass() {
            let currentCount = getNextCount();
            this.id_currentTime = `myCalendar_currentTime_${currentCount}`;
            this.id_currentDate = `myCalendar_currentDate_${currentCount}`;
            this.id_panelButton_prev = `myCalendar_panelButton_Prev_${currentCount}`;
            this.id_panelItem = `myCalendar_panelItem_${currentCount}`;
            this.id_panelButton_next = `myCalendar_panelButton_Next_${currentCount}`;
            this.class_tableValue = `myCalendar_tableValue_${currentCount}`;
        }

        // 获取日历的 dom
        getCalendarDomStr() {
            let templateStr = `<div class="myCalendar_body">
                <span>
                    <h1 id="${this.id_currentTime}" class="myCalendar_currentTime">--:--:--</h1>
                </span>
                <span>
                    <h3 id="${this.id_currentDate}" class="myCalendar_currentDate">--------</h3>
                </span>
                <hr>
                <div class="myCalendar_controlPanel">
                    <div class="myCalendar_panelButton" id="${this.id_panelButton_prev}"><b>&lt;</b></div>
                    <div class="myCalendar_panelItem" id="${this.id_panelItem}">${this.panelItemStr}</div>
                    <div class="myCalendar_panelButton" id="${this.id_panelButton_next}"><b>&gt;</b></div>
                </div>
                <table class="myCalendar_table">`;
            for (let i = 0; i < 7; i ++) {
                templateStr += `<tr>`;
                if (i === 0) {
                    let arr_dayInWeek = ['一', '二', '三', '四', '五', '六', '日'];
                    for (let j = 0; j < 7; j ++) {
                        templateStr += `<th>${arr_dayInWeek[j]}</th>`;
                    }
                } else {
                    for (let j = 0; j < 7; j ++) {
                        templateStr += `<td class="${this.class_tableValue} myCalendar_tableValue">&ensp;</td>`;
                    }
                }
                templateStr += `</tr>`;
            }
            templateStr += `</table>
                    <hr>
                    <p class="myCalendar_msg">Click to Note !</p>
                </div>`;
            return templateStr;
        }
    }
    CalendarModel.prototype.count = 0;

    // --- 对外暴露的接口 ---
    return {
        bind: bind
    };

})();
