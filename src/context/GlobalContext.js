import { createContext } from 'react';

const GlobalContext = createContext({
  monthIndex: 0, // initialValue. Wrapper에서 실제 초기값으로 변경될 예정
  setMonthIndex: (index) => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: (index) => {},
  daySelected: null,
  setDaySelected: (day) => {},
  showEventModal: false,
  setShowEventModal: () => {},
  savedEvents: [],
  dispatchCalEvent: ({ type, payload }) => {},
  selectedEvent: null,
  setSelectedEvent: () => {},
});

export default GlobalContext;
