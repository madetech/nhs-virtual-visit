import React from "react";
import Link from "next/link";
import classNames from "classnames";

const AnchorLink = ({ href, className, children, as, ...props }) => {
  if (/^https?:\/\//.test(href)) {
    return (
      <a className={classNames("nhsuk-link", className)} href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} as={as}>
      <a className={classNames("nhsuk-link", className)} {...props}>
        {children}
      </a>
    </Link>
  );
};

export default AnchorLink;
