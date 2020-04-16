import React, { useState, useEffect } from "react";
import Hint from "../../../src/components/Hint";
import Input from "../../../src/components/Input";
import Label from "../../../src/components/Label";
import ErrorMessage from "../ErrorMessage";

const DateSelect = ({ onChange, hasError, errorMessage }) => {
  const today = new Date();
  const [date, setDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    hour: today.getHours(),
    min: today.getMinutes(),
  });

  useEffect(() => onChange(date), [date]);

  return (
    <div className="nhsuk-form-group">
      <label className="nhsuk-label" for="select-1">
        Select the date and time for your call
      </label>
      <Hint>
        Pleas seleect the date and time you want to see the patient e.g
        12/12/2020 17:05
      </Hint>
      {hasError ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      <div class="nhsuk-date-input__item">
        <Label>Day</Label>
        <Input
          type="number"
          hasError={hasError}
          onChange={(event) => {
            setDate({ ...date, day: parseInt(event.target.value) });
          }}
          className="nhsuk-input nhsuk-date-input__input nhsuk-input--width-2"
          id="day"
          name="day"
          value={date.day}
          autoComplete="off"
        />
      </div>
      <div class="nhsuk-date-input__item">
        <Label>Month</Label>
        <Input
          type="number"
          hasError={hasError}
          className="nhsuk-input nhsuk-date-input__input nhsuk-input--width-2"
          id="month"
          name="month"
          onChange={(event) => {
            setDate({ ...date, month: parseInt(event.target.value) });
          }}
          value={date.month}
          autoComplete="off"
        />
      </div>
      <div class="nhsuk-date-input__item">
        <Label>Year</Label>
        <Input
          type="number"
          hasError={hasError}
          className="nhsuk-input--width-4"
          id="year"
          name="year"
          onChange={(event) => {
            setDate({ ...date, year: parseInt(event.target.value) });
          }}
          value={date.year}
          autoComplete="off"
        />
      </div>
      <div class="nhsuk-date-input__item">
        <Label>Hour</Label>
        <Input
          type="number"
          hasError={hasError}
          className="nhsuk-input--width-2"
          id="hour"
          name="hour"
          onChange={(event) => {
            setDate({ ...date, hour: parseInt(event.target.value) });
          }}
          value={date.hour}
          autoComplete="off"
        />
      </div>
      <div class="nhsuk-date-input__item">
        <Label>Min</Label>
        <Input
          type="number"
          hasError={hasError}
          className="nhsuk-input--width-2"
          id="min"
          name="min"
          onChange={(event) => {
            setDate({ ...date, min: parseInt(event.target.value) });
          }}
          value={date.min}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default DateSelect;
