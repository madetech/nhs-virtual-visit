const featureIsEnabled = (feature) => {
  return process.env[feature] === "true";
};

export default featureIsEnabled;
