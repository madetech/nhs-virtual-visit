import React, { useState } from "react";
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
              }}
            >
              Today
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => {
                setDisplayedVisits(filterUpcomingVisits(visits));
                setVisitsPanelListTitle("Upcoming");
              }}
            >
              Upcoming
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => {
                setDisplayedVisits(filterPastVisits(visits));
                setVisitsPanelListTitle("Past");
              }}
            >
              Past
            </a>
          </li>
        </ul>
      </div>

      <div className="nhsuk-grid-column-three-quarters">
        <VisitsPanelList
          visits={displayedVisits}
          title={visitsPanelListTitle}
        />
      </div>
    </div>
  );
};

export default AccordionVisits;
