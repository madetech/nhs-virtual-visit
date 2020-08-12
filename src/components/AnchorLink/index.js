import React from "react";
import Link from "next/link";
import classNames from "classnames";

const AnchorLink = ({ href, className, children, as }) => {
  if (/^https?:\/\//.test(href)) {
    return (
      <a className={classNames("nhsuk-link", className)} href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} as={as}>
      <a className={classNames("nhsuk-link", className)}>{children}</a>
    </Link>
  );
};

export default AnchorLink;
