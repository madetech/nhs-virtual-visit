import React, { useState, useEffect } from "react";
import Hint from "../../../src/components/Hint";
import Input from "../../../src/components/Input";
import Label from "../../../src/components/Label";
import ErrorMessage from "../ErrorMessage";
import FormGroup from "../FormGroup";
import moment from "moment";

const DateSelect = ({
  onChange,
  hasDateError,
  dateErrorMessage,
  hasTimeError,
  timeErrorMessage,
  initialDate,
}) => {
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
        <Label className="nhsuk-label--m">
          What is the date of their virtual visit?
        </Label>
        <Hint>For example, 1&zwj;6&zwj; 4&zwj; 2&zwj;0&zwj;2&zwj;0</Hint>
        {hasDateError ? <ErrorMessage>{dateErrorMessage}</ErrorMessage> : null}
        <div className="nhsuk-date-input__item">
          <FormGroup>
            <Label htmlFor="day">Day</Label>
            <Input
              type="number"
              hasError={hasDateError}
              onChange={(event) => {
                setDate({ ...date, day: parseInt(event.target.value) });
              }}
              className="nhsuk-input nhsuk-date-input__input nhsuk-input--width-2 nhsuk-input--width-10"
              id="day"
              name="day"
              value={date.day}
              autoComplete="off"
            />
          </FormGroup>
        </div>
        <div className="nhsuk-date-input__item">
          <FormGroup>
            <Label htmlFor="month">Month</Label>
            <Input
              type="number"
              hasError={hasDateError}
              className="nhsuk-input nhsuk-date-input__input nhsuk-input--width-2 nhsuk-input--width-10"
              id="month"
              name="month"
              onChange={(event) => {
                setDate({ ...date, month: parseInt(event.target.value) - 1 });
              }}
              value={Number(date.month) + 1}
              autoComplete="off"
            />
          </FormGroup>
        </div>
        <div className="nhsuk-date-input__item nhsuk-u-padding-bottom-5">
          <FormGroup>
            <Label htmlFor="year">Year</Label>
            <Input
              type="number"
              hasError={hasDateError}
              className="nhsuk-input--width-4 nhsuk-input--width-10"
              id="year"
              name="year"
              onChange={(event) => {
                setDate({ ...date, year: parseInt(event.target.value) });
              }}
              value={date.year}
              autoComplete="off"
            />
          </FormGroup>
        </div>
      </FormGroup>
      <FormGroup>
        <Label className="nhsuk-label--m">
          What is the time of their virtual visit?
        </Label>
        <Hint>For example, 15 00</Hint>
        {hasTimeError ? <ErrorMessage>{timeErrorMessage}</ErrorMessage> : null}
        <div className="nhsuk-date-input__item">
          <FormGroup>
            <Label htmlFor="hour">Hour</Label>
            <Input
              type="number"
              hasError={hasTimeError}
              className="nhsuk-input--width-2"
              id="hour"
              name="hour"
              onChange={(event) => {
                setDate({ ...date, hour: parseInt(event.target.value) });
              }}
              value={date.hour}
              autoComplete="off"
            />
          </FormGroup>
        </div>
        <div className="nhsuk-date-input__item">
          <FormGroup>
            <Label htmlFor="minute">Minutes</Label>
            <Input
              type="number"
              hasError={hasTimeError}
              className="nhsuk-input--width-2"
              id="minute"
              name="minute"
              onChange={(event) => {
                setDate({ ...date, minute: parseInt(event.target.value) });
              }}
              value={date.minute}
              autoComplete="off"
            />
          </FormGroup>
        </div>
      </FormGroup>
    </>
  );
};

export default DateSelect;
