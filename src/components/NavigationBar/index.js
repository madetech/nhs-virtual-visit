import React from "react";
import Link from "next/link";

const logout = async () => {
  await fetch("/api/session", {
    method: "DELETE",
  });

  window.location.href = "/wards/login";
};

const NavigationBar = ({ links, testId }) => (
  <nav
    className="nhsuk-header__navigation"
    id="header-navigation"
    role="navigation"
    aria-label="Primary navigation"
    aria-labelledby="label-navigation"
    data-testid={testId}
  >
    <div className="nhsuk-width-container">
      <p className="nhsuk-header__navigation-title">
        <span id="label-navigation">Menu</span>
        <button className="nhsuk-header__navigation-close" id="close-menu">
          <svg
            className="nhsuk-icon nhsuk-icon__close"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M13.41 12l5.3-5.29a1 1 0 1 0-1.42-1.42L12 10.59l-5.29-5.3a1 1 0 0 0-1.42 1.42l5.3 5.29-5.3 5.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l5.29-5.3 5.29 5.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"></path>
          </svg>
          <span className="nhsuk-u-visually-hidden">Close menu</span>
        </button>
      </p>
      <ul className="nhsuk-header__navigation-list">
        {links.map((link) => (
          <li className="nhsuk-header__navigation-item" key={link.text}>
            <Link href={link.href}>
              <a
                className="nhsuk-header__navigation-link"
                onClick={link?.onClick}
              >
                {link.text}
                <svg
                  className="nhsuk-icon nhsuk-icon__chevron-right"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z"></path>
                </svg>
              </a>
            </Link>
          </li>
        ))}

        <li className="nhsuk-header__navigation-item" key={"Log out"}>
          <Link href={"#"}>
            <a className="nhsuk-header__navigation-link" onClick={logout}>
              Log out
              <svg
                className="nhsuk-icon nhsuk-icon__chevron-right"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z"></path>
              </svg>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default NavigationBar;
