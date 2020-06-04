import React from "react";
import NavigationBar from "../NavigationBar";

const TrustAdminsNavigationBar = () => {
  const links = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Hospitals",
      href: "/trust-admin/hospitals",
    },
  ];

  return <NavigationBar links={links} testId="trust-admins-navbar" />;
};

export default TrustAdminsNavigationBar;
