export function validateHttpMethod(validMethod, method, res) {
  if (method !== validMethod) {
    res.status(405);
    res.end();
    return;
  }
}

export function checkIfAuthorised(token, res) {
  console.log("CheckIfAuthorised")
  if (!token) {
    res.status(401);
    res.end(JSON.stringify({ err: "Unauthorized" }));
    return;
  }
}

export default validateHttpMethod;
