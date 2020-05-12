import React from "react";

const SummaryList = ({ list, withActions }) => (
  <dl className="nhsuk-summary-list">
    {list.map((row) => (
      <div className="nhsuk-summary-list__row" key={row.key}>
        <dt className="nhsuk-summary-list__key">{row.key}</dt>
        <dd className="nhsuk-summary-list__value">{row.value}</dd>
        {withActions && (
          <dd className="nhsuk-summary-list__actions">
            <a
              href={row.actionLink || "#"}
              onClick={row.actionLinkOnClick || null}
            >
              Change
              <span className="nhsuk-u-visually-hidden">
                {` ${row.hiddenActionText}`}
              </span>
            </a>
          </dd>
        )}
      </div>
    ))}
  </dl>
);

export default SummaryList;
