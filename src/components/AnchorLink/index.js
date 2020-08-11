import React from "react";
import Link from "next/link";
import classNames from "classnames";

const AnchorLink = ({ href, className, children, as }) => (
  <Link href={href} as={as}>
    <a className={classNames("nhsuk-link", className)}>{children}</a>
  </Link>
);

export default AnchorLink;
