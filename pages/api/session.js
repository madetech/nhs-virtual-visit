import TokenProvider from "../../src/providers/TokenProvider";
import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  ({ body: { code }, method }, res, { container }) => {
    const allowedCodes = process.env.ALLOWED_CODES.split(",");
    const tokens = container.getTokenProvider();

    if (method !== "POST") {
      res.statusCode = 406;
      res.end();
      return;
    }

    if (!allowedCodes.includes(code)) {
      res.statusCode = 401;
      res.end();
      return;
    }

    const token = tokens.generate(code);
    const expiryHours = 2;
    let expiry = new Date();
    expiry.setTime(expiry.getTime() + expiryHours * 60 * 60 * 1000);

    res.writeHead(201, {
      "Set-Cookie": `token=${token}; httpOnly; path=/; expires=${expiry}`,
    });
    res.end(JSON.stringify({ wardId: code }));
  }
);
