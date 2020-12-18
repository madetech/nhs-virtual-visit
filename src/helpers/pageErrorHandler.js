export const hasError = (errors, field) =>
  errors.find((error) => error.id === `${field}-error`);

export const getErrorMessage = (errors, field) => {
  const error = errors.filter((err) => err.id === `${field}-error`);
  return error.length === 1 ? error[0].message : "";
};
