let MyCalendar = (function () {

    // --- Controller - 控制器 ---
    // 日历时间/日期显示控制器
    let calendarViewTimeManager = {
        timeStr: null,
        dateStr: null,
        timeElements: [],
        dateElements: [],
        loopSetDate: function () {
            window.setInterval(()=>{
                let date = new Date();
                calendarViewTimeManager.timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            }, 1000);
        },
        // 启动入口
        start: function (elements) {
            // 监控时间字符串变量，在改变时修改 dom
            Object.defineProperty(calendarViewTimeManager, 'timeStr', {
                get: function () {
                    return calendarViewTimeManager.timeStr;
                },
                set: function (timeStr) {
                    for (let timeElement of calendarViewTimeManager.timeElements) {
                        timeElement.innerHTML = timeStr;
                        // calendarViewTimeManager.timeStr = timeStr;
                    }
                }
            });
            // 设置元素数组，启动循环
            if (elements.length !== 0) {
                this.timeElements = elements;
                this.loopSetDate();
            }
        }
    };

    // // 每秒设置公有日期对象
    // const loopSetTimeAndDateStr = function () {
    //     window.setInterval(()=>{
    //         let date = new Date();
    //         timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    //     }, 1000);
    // };

    // 获取当前实例计数
    let getNextCount = function() {
        return CalendarModel.prototype.count ++;
    };

    // 根据当前时间循环设置 CalendarModel 的公有时间
    // window.setInterval(()=>{
    //     let date = new Date();
    //     let hour = date.getHours();
    //     let min = date.getMinutes();
    //     let sec = date.getSeconds();
    //     CalendarModel.prototype.currentTimeStr = hour + ':' + min + ':' + sec;
    //     // 处理下方日期
    //     let dayInMonth = date.getDate();
    //     if (dayInMonth !== CalendarModel.prototype.currentDateFlag) {
    //         CalendarModel.prototype.currentDateFlag = dayInMonth;
    //     }
    // }, 1000);

    // 启动日历，获取用户指定的元素，绑定日历实例
    let bind = function (data) {
        // 获取选择的元素，创建日历对象
        for (let selectorStr of data.selectors) {
            let eles = document.querySelectorAll(selectorStr);
            for (let ele of eles) {
                let newCalendarInstance = new CalendarModel();
                ele.innerHTML = newCalendarInstance.domStr;
            }
        }
        // 通过 时间/日期渲染管理器渲染时间
        let currentTimeEles = document.getElementsByClassName('myCalendar_currentTime');
        calendarViewTimeManager.start(currentTimeEles);
        // for (let ele in currentTimeEles) {
        //     window.setInterval(()=>{
        //         ele.innerHTML = timeStr;
        //     }, 1000);
        // }
    };

    // --- Model - 定义模型 ---
    class Calendar {
        constructor() {

        }
        setTimeAutoIncrement() {

        }
    }

    class CalendarModel extends Calendar{
        constructor() {
            super();
            // 部分 id 和 class
            this.id_currentTime = null;
            this.id_currentDate = null;
            this.id_panelButton_prev = null;
            this.id_panelItem = null;
            this.id_pabelButton_next = null;
            this.class_tableValue = null;

            // this.currentTimeStr = '00:00:00';
            // this.currentDateStr = '--------';
            this.panelItemStr = '-------';
            this.dateTableData = [[], [], [], [], [], []];
            this.notes = {};

            // 设置当前实例的 id 和 class(用于设置值)
            this.setIdAndClass();

            // 公有时间设置为自动增长
            // this.setTimeAutoIncrement();

            // 设置当前模型的 dom
            this.domStr = this.getCalendarDomStr();
        }

        // 每秒将当前实例的 时间视图 置为 公有时间
        // setTimeAutoIncrement() {
        //     window.setInterval(()=>{
        //         document.getElementById(this.id_currentTime).innerHTML = this.currentTimeStr;
        //     }, 1000);
        // };

        // 设置当前实例的 id 和 class
        setIdAndClass() {
            let currentCount = getNextCount();
            this.id_currentTime = `myCalendar_currentTime_${currentCount}`;
            this.id_currentDate = `myCalendar_currentDate_${currentCount}`;
            this.id_panelButton_prev = `myCalendar_panelButton_Prev_${currentCount}`;
            this.id_panelItem = `myCalendar_panelItem_${currentCount}`;
            this.id_pabelButton_next = `myCalendar_panelButton_Next_${currentCount}`;
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
                    <div class="myCalendar_panelButton" id="${this.id_panelButton_prev}">&lt;</div>
                    <div class="myCalendar_panelItem" id="${this.id_panelItem}">${this.panelItemStr}</div>
                    <div class="myCalendar_panelButton" id="${this.id_pabelButton_next}">&gt;</div>
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
                        templateStr += `<td class="${this.class_tableValue}">&ensp;</td>`;
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
