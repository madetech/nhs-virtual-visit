export function validateHttpMethod(validMethod, method, res) {
  if (method !== validMethod) {
    res.status(405);
    res.end();
    return;
  }
}

export function checkIfAuthorised(token, res) {
  if (!token) {
    res.status(401);
    res.end(JSON.stringify({ err: "Unauthorized" }));
    return false;
  }

  return true;
}

export default validateHttpMethod;
