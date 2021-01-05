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
    {
      text: "Log out",
      href: "/trust-admin#",
      onClick: logout,
    },
  ];

  return <NavigationBar links={links} testId="trust-admins-navbar" />;
};

const logout = async () => {
  await fetch("/api/session", { method: "DELETE" });
  window.location.href = "/login";
};

export default TrustAdminsNavigationBar;
