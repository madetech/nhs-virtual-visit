export default function validateHttpMethod(validMethod, method, res) {
  if (method !== validMethod) {
    res.status(405);
    res.end();
    return;
  }
}
