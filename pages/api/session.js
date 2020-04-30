import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ body: { code }, method }, res, { container }) => {
    if (method !== "POST") {
      res.statusCode = 406;
      res.end();
      return;
    }

    const verifyWardCode = container.getVerifyWardCode();
    const verifyWardCodeResponse = await verifyWardCode(code);

    if (!verifyWardCodeResponse.validWardCode) {
      res.statusCode = 401;
      res.end();
      return;
    }

    const tokens = container.getTokenProvider();
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
