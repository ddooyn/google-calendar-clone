import React, { useEffect, useMemo, useReducer, useState } from 'react';
import GlobalContext from './GlobalContext';
import dayjs from 'dayjs';

const savedEventsReducer = (state, { type, payload }) => {
  switch (type) {
    case 'push':
      return [...state, payload];
    case 'update':
      return state.map((evt) => (evt.id === payload.id ? payload : evt)); // ๐
    case 'delete':
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
};

const initEvents = () => {
  const storageEvents = localStorage.getItem('savedEvents');
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : []; // โญ ๊ฐ์ ธ์ฌ ๋๋ JSON.parse
  return parsedEvents;
};

const ContextWrapper = (props) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [labels, setLabels] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  ); // reducer, initialValue, initFunction ์ธ์ 3๊ฐ
  // https://ko.reactjs.org/docs/hooks-reference.html#usereducer
  // ๐ useState์ ๋์ฒด ํจ์์๋๋ค. (state, action) => newState์ ํํ๋ก reducer๋ฅผ ๋ฐ๊ณ  dispatch ๋ฉ์๋์ ์ง์ ํํ๋ก ํ์ฌ state๋ฅผ ๋ฐํํฉ๋๋ค. (Redux์ ์ต์ํ๋ค๋ฉด ์ด๊ฒ์ด ์ด๋ป๊ฒ ๋์ํ๋์ง ์ฌ๋ฌ๋ถ์ ์ด๋ฏธ ์๊ณ  ์์ ๊ฒ์๋๋ค.)
  // ๐ ์ด๊ธฐ state๋ฅผ ์กฐ๊ธ ์ง์ฐํด์ ์์ฑํ  ์๋ ์์ต๋๋ค. ์ด๋ฅผ ์ํด์๋ init ํจ์๋ฅผ ์ธ ๋ฒ์งธ ์ธ์๋ก ์ ๋ฌํฉ๋๋ค. ์ด๊ธฐ state๋ init(initialArg)์ ์ค์ ๋  ๊ฒ์๋๋ค.

  const filteredEvents = useMemo(() => {
    return savedEvents.filter(
      (evt) =>
        labels
          .filter((lbl) => lbl.checked)
          .map((lbl) => lbl.label)
          .includes(evt.label) // ๐ true of false
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem('savedEvents', JSON.stringify(savedEvents)); // โญ ์ ์ฅํ  ๋๋ JSON.stringify
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  // ๐ FIX: ๋ชจ๋ฌ์ ๋ด์ฉ๋จ๋ ๋ฒ๊ทธ ํด๊ฒฐ
  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  const updateLabel = (label) => {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  };

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        savedEvents,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        labels,
        setLabels,
        updateLabel,
        filteredEvents,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;
