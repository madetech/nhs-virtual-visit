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
    {
      text: "Log out",
      href: "#",
      onClick: logout,
    },
  ];

  return <NavigationBar links={links} testId="wards-navbar" />;
};

const logout = async () => {
  await fetch("/api/session", { method: "DELETE" });

  window.location.href = "/wards/login";
};

export default WardsNavigationBar;
