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
  const [showButtons, setShowButtons] = useState(true);

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
              visitsPanelListTitle == "Past" ? "nhsuk-u-font-weight-bold" : ""
            }
          >
            <a
              href="#"
              onClick={() => {
                setDisplayedVisits(filterPastVisits(visits));
                setVisitsPanelListTitle("Past");
                setShowButtons(false);
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
          showButtons={showButtons}
        />
      </div>
    </div>
  );
};

export default AccordionVisits;
