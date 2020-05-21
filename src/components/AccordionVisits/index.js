import React, { useState, useEffect } from "react";
import filterTodaysVisits from "../../helpers/filterTodaysVisits";
import filterUpcomingVisits from "../../helpers/filterUpcomingVisits";
import filterPastVisits from "../../helpers/filterPastVisits";
import VisitsPanelList from "../VisitsPanelList";
import "./styles.scss";

const AccordionVisits = ({ visits }) => {
  const [displayedVisits, setDisplayedVisits] = useState(
    filterTodaysVisits(visits)
  );
  const [visitsPanelListTitle, setVisitsPanelListTitle] = useState("Today");
  const [showButtons, setShowButtons] = useState(true);

  const oneMinute = 60000;

  useEffect(() => {
    const interval = setInterval(() => {
      let updatedVisits;

      if (visitsPanelListTitle === "Today") {
        updatedVisits = filterTodaysVisits(visits);
      } else if (visitsPanelListTitle === "Upcoming") {
        updatedVisits = filterUpcomingVisits(visits);
      } else {
        updatedVisits = filterPastVisits(visits);
      }

      setDisplayedVisits(updatedVisits);
    }, oneMinute);
    return () => clearInterval(interval);
  }, [visitsPanelListTitle]);

  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-one-quarter">
        <ul className="nhsuk-list">
          <li
            className={
              visitsPanelListTitle == "Today" ? "nhsuk-u-font-weight-bold" : ""
            }
          >
            <a
              href="#"
              onClick={() => {
                setDisplayedVisits(filterTodaysVisits(visits));
                setVisitsPanelListTitle("Today");
                setShowButtons(true);
              }}
            >
              Today
            </a>
          </li>
          <li
            className={
              visitsPanelListTitle == "Upcoming"
                ? "nhsuk-u-font-weight-bold"
                : ""
            }
          >
            <a
              href="#"
              onClick={() => {
                setDisplayedVisits(filterUpcomingVisits(visits));
                setVisitsPanelListTitle("Upcoming");
                setShowButtons(true);
              }}
            >
              Upcoming
            </a>
          </li>
          <li
            className={
              visitsPanelListTitle == "Past 12 hours"
                ? "nhsuk-u-font-weight-bold"
                : ""
            }
          >
            <a
              href="#"
              onClick={() => {
                setDisplayedVisits(filterPastVisits(visits));
                setVisitsPanelListTitle("Past 12 hours");
                setShowButtons(true);
              }}
            >
              Past 12 hours
            </a>
          </li>
        </ul>
      </div>

      <div className="nhsuk-grid-column-three-quarters">
        <VisitsPanelList
          visits={displayedVisits}
          title={visitsPanelListTitle}
          showButtons={showButtons}
        />
      </div>
    </div>
  );
};

export default AccordionVisits;
