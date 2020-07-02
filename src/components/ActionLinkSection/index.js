import React from "react";
import ActionLink from "../ActionLink";

const ActionLinkSection = ({ heading, link, linkText, children }) => {
  if (link) {
    return (
      <>
        <h2>{heading}</h2>
        {children}
        <ActionLink href={link}>{linkText}</ActionLink>
      </>
    );
  } else {
    return null;
  }
};

export default ActionLinkSection;
