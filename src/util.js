import dayjs from 'dayjs';

export const getMonth = (month = dayjs().month()) => { // 기본값 지금 달
  // 🐛 small calendar 이동 후 큰 캘린더 Today 눌렀을 때 현재 달로 안 오는 버그 수정
  month = Math.floor(month);
  const year = dayjs().year(); // 지금 연도
  const firstDayOfMonth = dayjs(new Date(year, month, 1)).day(); // 지금년월의 첫째날
  let currentMonthCount = 0 - firstDayOfMonth; // 음수 값은 지난 달 날짜로 취급

  const daysMatrix = new Array(5).fill([]).map(() => { // 5행
    return new Array(7).fill(null).map(() => { // 7열 (일~토요일)
      currentMonthCount++; // 1일씩 증가
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });

  return daysMatrix;
};
