export default (keys) =>
  keys.reduce((acc, key) => {
    acc[key] = `${key} value`;
    return acc;
  }, {});
