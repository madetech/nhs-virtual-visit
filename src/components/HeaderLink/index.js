import React from "react";
import Link from "next/link";

const HeaderLink = ({ children, enabled }) => {
  if (enabled) {
    return (
      <Link href="/">
        <a className="nhsuk-header__link">{children}</a>
      </Link>
    );
  } else {
    return children;
  }
};

export default HeaderLink;
