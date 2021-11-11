import React, { useState, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { addLocale } from 'primereact/api';

addLocale('mn', {
  firstDayOfWeek: 1,
  dayNames: ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'],
  dayNamesShort: ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'],
  dayNamesMin: ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'],
  monthNames: [
    '1-р сар',
    '2-р сар',
    '3-р сар',
    '4-р сар',
    '5-р сар',
    '6-р сар',
    '7-р сар',
    '8-р сар',
    '9-р сар',
    '10-р сар',
    '11-р сар',
    '12-р сар',
  ],
  monthNamesShort: [
    '1-р сар',
    '2-р сар',
    '3-р сар',
    '4-р сар',
    '5-р сар',
    '6-р сар',
    '7-р сар',
    '8-р сар',
    '9-р сар',
    '10-р сар',
    '11-р сар',
    '12-р сар',
  ],
  today: 'Өнөөдөр',
  clear: 'Устгах',
});

const renderDateFilter = () => {
  const [dateFilter, setDateFilter] = useState(null);
  const dt = useRef(null);

  const monthNavigatorTemplate = e => (
    <Dropdown
      value={e.value}
      options={e.options}
      onChange={event => e.onChange(event.originalEvent, event.value)}
      style={{ lineHeight: 1 }}
    />
  );

  const yearNavigatorTemplate = e => (
    <Dropdown
      value={e.value}
      options={e.options}
      onChange={event => e.onChange(event.originalEvent, event.value)}
      className="p-ml-2"
      style={{ lineHeight: 1, marginLeft: '10px' }}
    />
  );

  const formatDate = date => {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }

    return `${date.getFullYear()}-${month}-${day}`;
  };

  const onDateFilterChange = event => {
    if (event.value !== null) {
      dt.current.filter(formatDate(event.value), 'startDate', 'equals');
    } else {
      dt.current.filter(null, 'startDate', 'equals');
    }

    setDateFilter(event.value);
  };
  return (
    <Calendar
      value={dateFilter}
      onChange={onDateFilterChange}
      placeholder="Хайх"
      dateFormat="yy-mm-dd"
      className="p-column-filter"
      monthNavigator
      yearNavigator
      yearRange="2010:2030"
      yearNavigatorTemplate={yearNavigatorTemplate}
      monthNavigatorTemplate={monthNavigatorTemplate}
      locale="mn"
    />
  );
};

export default renderDateFilter;
