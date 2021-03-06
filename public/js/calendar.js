const calendarWrapper = document.querySelector('.calendars-wrapper');

export class Calendar {
  constructor(target) {
    this.target = target;
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
  }

  init() {
    const weeks = document.querySelectorAll('.calendar-weeks');
    const days = document.querySelectorAll('.calendar-days');
    weeks.forEach((week) => (week.innerHTML = ''));
    days.forEach((day) => (day.innerHTML = ''));
  }

  onFocusOut({ target }) {
    if (
      !target.closest('.input-date') &&
      !target.closest('.calendars-wrapper')
    ) {
      calendarWrapper.classList.add('calendars-wrapper-hidden');
    } else return;
  }

  onEvents() {
    this.target.addEventListener('click', this.dateClickHandler);
    document.body.addEventListener('click', this.onFocusOut);

    this.render();
    this.onClickArrowBtn();
    this.onClickDays();
  }

  onClickArrowBtn() {
    const [leftBtn, rightBtn] = document.querySelectorAll('.calendar-btn');
    leftBtn.addEventListener('click', this.leftBtnClickHandler.bind(this));
    rightBtn.addEventListener('click', this.rightBtnClickHandler.bind(this));
  }

  onClickDays() {
    const calendars = document.querySelector('.calendar-container');
    calendars.addEventListener('click', this.dayClickHandler.bind(this));
  }

  dayClickHandler({ target }) {
    const isNumber = target.innerText;
    const day = target.closest('.calendar-days .calendar-day');

    if (isNumber && day) {
      day.classList.toggle('calendar-day-clicked');
    }

    const dayClicked = document.querySelectorAll('.calendar-day-clicked');
    const daysClickedCount = Array.from(dayClicked) //
      .filter((day) => day.classList.contains('calendar-day-clicked')).length;

    this.paintClickedDaysGap(daysClickedCount, target);
  }

  paintClickedDaysGap(dayClicked, target) {
    const [dayLists, dayClickedIndex] = this.getClickedDayList();
    switch (dayClicked) {
      case 1:
        this.initPaintBetweenDays(dayLists);
        break;
      case 2:
        const [firstD, lastD] = dayClickedIndex;
        this.paintBetweenDays(dayLists, firstD, lastD);
        break;
      case 3:
        const [firstDay, middle, lastDay] = dayClickedIndex;
        const clickedNumber = this.getLastClickNumber(
          dayLists,
          Number(target.innerText),
          target,
          middle,
          lastDay
        );
        this.initPaintBetweenDays(dayLists);
        this.paintBetweenDays(dayLists, firstDay, clickedNumber);
        break;
      default:
    }
  }

  initPaintBetweenDays(dayLists) {
    dayLists.forEach((day) => day.classList.remove('calendar-day-between'));
  }

  paintBetweenDays(dayLists, firstDay, LastDay) {
    dayLists
      .slice(firstDay, LastDay + 1)
      .forEach((day) => day.classList.add('calendar-day-between'));
  }

  getClickedDayList() {
    const days = document.querySelectorAll('.calendar-day');
    const daysNodeArr = Array.from(days);
    const clickedIndex = daysNodeArr //
      .map((day, idx) => {
        if (day.classList.contains('calendar-day-clicked')) return idx;
      })
      .filter((isNumber) => typeof isNumber === 'number');
    return [daysNodeArr, clickedIndex];
  }

  getLastClickNumber(dayLists, clickedNumber, target, middle, lastDay) {
    if (!target.classList.contains('calendar-day-between')) {
      clickedNumber += lastDay;
    }

    if (clickedNumber > lastDay) {
      dayLists[middle].classList.remove('calendar-day-clicked');
      clickedNumber = lastDay;
    } else {
      dayLists[lastDay].classList.remove('calendar-day-clicked');
      clickedNumber = middle;
    }

    return clickedNumber;
  }

  rightBtnClickHandler({ target }) {
    if (!target.closest('.right-arrow')) return;
    this.month += 1;

    this.init();
    this.render();
  }

  leftBtnClickHandler({ target }) {
    if (!target.closest('.left-arrow')) return;
    this.month -= 1;

    this.init();
    this.render();
  }

  dateClickHandler() {
    calendarWrapper?.classList.toggle('calendars-wrapper-hidden');
  }

  showCalendarTitle() {
    const calendarTitles = document.querySelectorAll('.calendar-title');

    calendarTitles.forEach((title, idx) => {
      const [count, i] = this.calculateSecondCalendar(idx);
      title.textContent = `${this.year + count}년 ${this.month + i}월`;
    });
  }

  showCalendarWeeks() {
    const daysofWeekList = '일월화수목금토'.split('');
    const calendarWeek = document.querySelectorAll('.calendar-weeks');
    const daysOfWeeks = daysofWeekList.reduce((prev, dayOfWeek) => {
      return prev + `<li>${dayOfWeek}</li>`;
    }, '');

    calendarWeek.forEach((week) =>
      week.insertAdjacentHTML('beforeend', daysOfWeeks)
    );
  }

  showCalendarDays() {
    const calendarDays = document.querySelectorAll('.calendar-days');
    calendarDays.forEach((day, secondCalMonth) => {
      const [count, i] = this.calculateSecondCalendar(secondCalMonth);
      const daysLen = new Date(this.year + count, this.month + i, 0).getDate();
      let daysEmpty = new Date(
        `'${this.year + count}, ${this.month + i}, 1'`
      ).getDay();

      const daysByOrder = Array.from(
        { length: daysLen + daysEmpty },
        (_, idx) => idx + 1 - daysEmpty
      );

      const days = daysByOrder.reduce((prev, day) => {
        if (daysEmpty) {
          daysEmpty -= 1;
          return prev + `<div></div>`;
        }
        return (
          prev +
          `
          <div class="calendar-day">
            <span>${day}</span>
          </div>`
        );
      }, '');
      day.insertAdjacentHTML('beforeend', days);
    });
  }

  verifyFullDates() {
    if (this.month === 13) {
      this.year += 1;
      this.month = 1;
    }
    if (this.month === 0) {
      this.year -= 1;
      this.month = 12;
    }
  }

  calculateSecondCalendar(secondCalMonth) {
    let count = 0;
    if (this.month === 12 && secondCalMonth === 1) {
      count = 1;
      secondCalMonth = -11;
      return [count, secondCalMonth];
    }
    return [count, secondCalMonth];
  }

  render() {
    this.verifyFullDates();
    this.showCalendarTitle();
    this.showCalendarWeeks();
    this.showCalendarDays();
  }
}
