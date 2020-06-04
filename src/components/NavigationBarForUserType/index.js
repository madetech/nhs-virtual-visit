import React from "react";
import WardsNavigationBar from "../WardsNavigationBar";
import { WARD_STAFF } from "../../helpers/userTypes";

const NavigationBarForUserType = ({ userType }) => {
  if (userType === WARD_STAFF) {
    return <WardsNavigationBar />;
  }

  return null;
};

export default NavigationBarForUserType;
