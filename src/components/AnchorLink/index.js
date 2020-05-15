import React from "react";
import Link from "next/link";

const AnchorLink = ({ href, children }) => (
  <Link href={href}>
    <a className="nhsuk-link">{children}</a>
  </Link>
);

export default AnchorLink;
