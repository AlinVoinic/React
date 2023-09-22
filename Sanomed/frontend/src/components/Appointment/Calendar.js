import { useState } from "react";
import ReactDatePicker from "react-datepicker";

import moment from "moment";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import "./Programare.css";
import "react-datepicker/dist/react-datepicker.css";

function Calendar() {
  const [startDate, setStartDate] = useState(null);

  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  return (
    <div className="calendar">
      <ReactDatePicker
        placeholderText={
          startDate
            ? startDate.toLocaleString()
            : "Selectează o dată din calendar"
        }
        id="calendar"
        name="calendar"
        required
        showTimeSelect
        showWeekNumbers
        onChange={(date) =>
          setStartDate(moment(date).format("MMMM Do YYYY, h:mm a"))
        }
        selected={startDate}
        minDate={addDays(new Date(), 1)}
        maxDate={addDays(new Date(), 30)}
        minTime={setHours(setMinutes(new Date(), 0), 9)}
        maxTime={setHours(setMinutes(new Date(), 30), 17)}
        filterDate={isWeekday}
        calendarStartDay={1}
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="Ora"
        dateFormat="MMMM d, yyyy h:mm aa"
        excludeTimes={[
          //exclude date deja programate din backend
          setHours(setMinutes(new Date(), 0), 13),
          setHours(setMinutes(new Date(), 30), 13),
        ]}
        form="app-form"
      />
    </div>
  );
}

export default Calendar;
