import withContainer from "../../src/middleware/withContainer";
import GovNotify from "../../src/gateways/GovNotify";
import jwt from "jsonwebtoken";

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

  const retrieveEmailAndHashedPassword = container.getRetrieveEmailAndHashedPassword();
  const {
    emailAddress,
    hashedPassword,
    error,
  } = await retrieveEmailAndHashedPassword(body.email);

  if (error || !emailAddress) {
    res.status(400);
    res.end(JSON.stringify({ err: "Email does not exist" }));
    return;
  }

  const notifyClient = await GovNotify.getInstance();
  const templateId = "a750f140-ff1a-47e2-b60b-0419c8454c23";
  const link = createLink(emailAddress, hashedPassword);
  const personalisation = { link: link };
  const reference = null;

  try {
    await notifyClient.sendEmail(templateId, emailAddress, {
      personalisation: personalisation,
      reference: reference,
    });
    res.status(201);
    res.end(JSON.stringify({ success: true }));
  } catch (err) {
    res.status(401);
    res.end(
      JSON.stringify({
        err: `GovNotify error occurred: ${err?.error?.errors[0]?.message}`,
      })
    );
  }
});

const createLink = (emailAddress, hashedPassword) => {
  const token = jwt.sign({ emailAddress, hashedPassword }, hashedPassword, {
    expiresIn: "2h",
  });
  const url = `http://localhost:3000/reset-password/${token}`;
  return url;
};
