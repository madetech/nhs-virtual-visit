import React from "react";
import classnames from "classnames";

const LogoutButton = ({
  children,
  className,
  renderLogout = false,
  type = "submit",
  ...others
}) => {
  const logout = async () => {
    await fetch("/api/session", {
      method: "DELETE",
    });

    window.location.href = "/wards/login";
  };

  if (renderLogout) {
    return (
      <button
        type={type}
        className={classnames("nhsuk-button nhsuk-button--reverse", className)}
        onClick={logout}
        style={{ marginBottom: "0", padding: "8px 12px" }}
        {...others}
      >
        Log out
        {children}
      </button>
    );
  } else {
    return null;
  }
};

export default LogoutButton;
