import withContainer from "../../src/middleware/withContainer";
import { validateHttpMethod } from "../../src/helpers/apiErrorHandler";

export default withContainer(async ({ body, method }, res, { container }) => {
  validateHttpMethod("POST", method, res);

  if (!body.password) {
    res.status(400);
    res.end(JSON.stringify({ err: "password must be present" }));
    return;
  }

  if (!body.email) {
    res.status(400);
    res.end(JSON.stringify({ err: "email must be present" }));
    return;
  }

  res.setHeader("Content-Type", "application/json");

  const email = body.email
  const password = body.password;
  const resetPassword = container.getResetPassword();
  const { resetSuccess, error } = await resetPassword({ email, password });

  if (error) {
    res.status(400);
    res.end(JSON.stringify({ err: "error resetting password" }));
  } else {
    res.status(201);
    res.end(JSON.stringify({ resetSuccess }));
  }
});
