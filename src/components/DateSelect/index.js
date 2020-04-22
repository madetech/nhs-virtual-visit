import React, { useState, useEffect } from "react";
import Hint from "../../../src/components/Hint";
import Input from "../../../src/components/Input";
import Label from "../../../src/components/Label";
import ErrorMessage from "../ErrorMessage";
import FormGroup from "../FormGroup";
import moment from "moment";

const DateSelect = ({ onChange, hasError, errorMessage, initialDate }) => {
  const today = new Date();

  let date, setDate;

  if (initialDate) {
    [date, setDate] = useState(initialDate);
  } else {
    [date, setDate] = useState(() => {
      let defaultDate = moment(today).add(10, "m").toDate();

      return {
        year: defaultDate.getFullYear(),
        month: defaultDate.getMonth(),
        day: defaultDate.getDate(),
        hour: defaultDate.getHours().toString().padStart(2, "0"),
        minute: defaultDate.getMinutes().toString().padStart(2, "0"),
      };
    });
  }

  useEffect(() => onChange(date), [date]);

  return (
    <>
      <FormGroup>
        <Label>What is the date of their virtual visit?</Label>
        <Hint>For example, 16 4 2020</Hint>
        {hasError ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        <div className="nhsuk-date-input__item">
          <Label>Day</Label>
          <Input
            style={{ padding: "32px 16px!important" }}
            type="number"
            hasError={hasError}
            onChange={(event) => {
              setDate({ ...date, day: parseInt(event.target.value) });
            }}
            className="nhsuk-input nhsuk-date-input__input nhsuk-input--width-2 nhsuk-u-font-size-32 nhsuk-input--width-10"
            id="day"
            name="day"
            value={date.day}
            autoComplete="off"
          />
        </div>
        <div className="nhsuk-date-input__item">
          <Label>Month</Label>
          <Input
            style={{ padding: "32px 16px!important" }}
            type="number"
            hasError={hasError}
            className="nhsuk-input nhsuk-date-input__input nhsuk-input--width-2 nhsuk-u-font-size-32 nhsuk-input--width-10"
            id="month"
            name="month"
            onChange={(event) => {
              setDate({ ...date, month: parseInt(event.target.value) - 1 });
            }}
            value={date.month + 1}
            autoComplete="off"
          />
        </div>
        <div className="nhsuk-date-input__item nhsuk-u-padding-bottom-5">
          <Label>Year</Label>
          <Input
            style={{ padding: "32px 16px!important" }}
            type="number"
            hasError={hasError}
            className="nhsuk-input--width-4 nhsuk-u-font-size-32 nhsuk-input--width-10"
            id="year"
            name="year"
            onChange={(event) => {
              setDate({ ...date, year: parseInt(event.target.value) });
            }}
            value={date.year}
            autoComplete="off"
          />
        </div>
      </FormGroup>
      <FormGroup>
        <Label>What is the time of their virtual visit?</Label>
        <Hint>For example, 15 00</Hint>
        <div className="nhsuk-date-input__item">
          <Label>Hour</Label>
          <Input
            style={{ padding: "32px 16px!important" }}
            type="number"
            hasError={hasError}
            className="nhsuk-input--width-2 nhsuk-u-font-size-32"
            id="hour"
            name="hour"
            onChange={(event) => {
              setDate({ ...date, hour: parseInt(event.target.value) });
            }}
            value={date.hour}
            autoComplete="off"
          />
        </div>
        <div className="nhsuk-date-input__item">
          <Label>Minutes</Label>
          <Input
            style={{ padding: "32px 16px!important" }}
            type="number"
            hasError={hasError}
            className="nhsuk-input--width-2 nhsuk-u-font-size-32"
            id="minute"
            name="minute"
            onChange={(event) => {
              setDate({ ...date, minute: parseInt(event.target.value) });
            }}
            value={date.minute}
            autoComplete="off"
          />
        </div>
      </FormGroup>
    </>
  );
};

export default DateSelect;
