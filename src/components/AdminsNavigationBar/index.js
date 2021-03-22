import React from "react";
import NavigationBar from "../NavigationBar";

const AdminsNavigationBar = () => {
  const links = [
    {
      text: "Home",
      href: "/admin",
    },
    {
      text: "Log out",
      href: "/",
      onClick: logout,
    },
  ];

  return <NavigationBar links={links} testId="admins-navbar" />;
};

const logout = async () => {
  await fetch("/api/session", { method: "DELETE" });

  window.location.href = "/";
};

export default AdminsNavigationBar;
