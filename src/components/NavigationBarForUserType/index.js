import React from "react";
import WardsNavigationBar from "../WardsNavigationBar";
import TrustAdminsNavigationBar from "../TrustAdminsNavigationBar";
import { WARD_STAFF, TRUST_ADMIN, ADMIN } from "../../helpers/userTypes";
import AdminsNavigationBar from "../AdminsNavigationBar";

const NavigationBarForUserType = ({ userType }) => {
  switch (userType) {
    case WARD_STAFF:
      return <WardsNavigationBar />;
    case TRUST_ADMIN:
      return <TrustAdminsNavigationBar />;
    case ADMIN:
      return <AdminsNavigationBar />;
    default:
      return null;
  }
};

export default NavigationBarForUserType;
