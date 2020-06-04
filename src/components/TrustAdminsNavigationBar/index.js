import React from "react";
import NavigationBar from "../NavigationBar";

const logout = async () => {
  await fetch("/api/session", {
    method: "DELETE",
  });

  window.location.href = "/wards/login";
};

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
    {
      text: "Log out",
      href: "#",
      onClick: logout,
    },
  ];

  return <NavigationBar links={links} testId="trust-admins-navbar" />;
};

export default TrustAdminsNavigationBar;
