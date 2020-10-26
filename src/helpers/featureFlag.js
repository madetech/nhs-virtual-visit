const featureIsEnabled = (feature) => {
  return process.env[feature] === "yes" ? true : false;
};

export default featureIsEnabled;
