import React from "react";
import Link from "next/link";
import classNames from "classnames";

const AnchorLink = ({ href, className, children }) => (
  <Link href={href}>
    <a className={classNames("nhsuk-link", className)}>{children}</a>
  </Link>
);

export default AnchorLink;
