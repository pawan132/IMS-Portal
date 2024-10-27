import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CustomCalendar.css'; // Make sure this file exists

const localizer = momentLocalizer(moment);

const CustomTimeSlotWrapper = ({ children, value, offHoursByDay }) => {
  // console.log("first",offHoursByDay)
  const dayOfWeek = value.getDay(); // Get the day of the week (0-6)
  const hour = value.getHours();
  const minutes = value.getMinutes();
  const timeInDecimal = hour + minutes / 60; // Convert to decimal (e.g., 9:30 AM = 9.5)

  const offHours = offHoursByDay[dayOfWeek];
  const isOffHour = !offHours || timeInDecimal < offHours.start || timeInDecimal >= offHours.end;

  return (
    <div className={`rbc-time-slot ${isOffHour ? 'off-hours-disabled' : ''}`}>
      {React.cloneElement(React.Children.only(children))}
    </div>
  );
};

const CalendarView = ({ data, eventStyle, calendarView, customToolbar, offHoursByDay }) => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyle}
        views={calendarView}
        components={{
          timeSlotWrapper: (props) => (
            <CustomTimeSlotWrapper {...props} offHoursByDay={offHoursByDay} />
          ),
          toolbar: customToolbar,
        }}
      />
    </div>
  );
};

export default CalendarView;
