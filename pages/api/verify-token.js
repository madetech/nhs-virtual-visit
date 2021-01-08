/*import withContainer from "../../src/middleware/withContainer";
import jwt from "jsonwebtoken";

export default withContainer(async ({ body, method }, res) => {
  if (method !== "POST") {
    res.status(405);
    res.end(JSON.stringify({ err: "method not allowed" }));
    return;
  }

  if (!body.token) {
    res.status(400);
    res.end(JSON.stringify({ err: "token must be provided" }));
    return;
  }

  res.setHeader("Content-Type", "application/json");

  const token = body.token;
  const { emailAddress } = jwt.decode(token);

  try {
    jwt.verify(token, process.env.JWT_SIGNING_KEY);
  } catch (error) {
    res.status(400);
    res.end(JSON.stringify({ err: "Token does not exist or has expired." }));
  }
  res.status(201);
  res.end(JSON.stringify({ emailAddress }))
});
  */
