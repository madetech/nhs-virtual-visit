import React from "react";
import NavigationBar from "../NavigationBar";

const AdminsNavigationBar = () => {
  const links = [
    {
      text: "Home",
      href: "/",
    },
  ];

  return <NavigationBar links={links} testId="admins-navbar" />;
};

export default AdminsNavigationBar;
