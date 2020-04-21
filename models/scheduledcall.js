"use strict";
module.exports = (sequelize, DataTypes) => {
  const ScheduledCall = sequelize.define(
    "ScheduledCall",
    {
      patientName: DataTypes.STRING,
      callTime: DataTypes.DATE,
      recipientNumber: DataTypes.STRING,
      callId: DataTypes.STRING,
    },
    {}
  );
  ScheduledCall.associate = function (models) {
    // associations can be defined here
  };
  return ScheduledCall;
};
