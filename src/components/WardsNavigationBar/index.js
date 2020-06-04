import React from "react";
import NavigationBar from "../NavigationBar";

const WardsNavigationBar = () => {
  const links = [
    {
      text: "Home",
      href: "/wards/visits",
    },
    {
      text: "Book a virtual visit",
      href: "/wards/book-a-visit-start",
    },
  ];

  return <NavigationBar links={links} testId="wards-navbar" />;
};

export default WardsNavigationBar;
