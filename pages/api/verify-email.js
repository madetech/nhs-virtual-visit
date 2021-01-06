import withContainer from "../../src/middleware/withContainer";

export default withContainer(async ({ body, method }, res, { container }) => {
  if (method !== "POST") {
    res.status(405);
    res.end(JSON.stringify({ err: "method not allowed" }));
    return;
  }

  if (!body.email) {
    res.status(400);
    res.end(JSON.stringify({ err: "email must be present" }));
    return;
  }

  res.setHeader("Content-Type", "application/json");

  const retrieveEmail = container.getRetrieveEmail();
  const { validEmail, error } = await retrieveEmail(body.email);

  if (error || !validEmail) {
    res.status(400);
    res.end(JSON.stringify({ err: "Email does not exist" }));
  } else {
    res.status(201);
    res.end(JSON.stringify({ validEmail }));
  }
});
