import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ body: { code }, method }, res, { container }) => {
    if (method === "POST") {
      const allowedAdminCodes = process.env.ADMIN_AUTH_CODES;
      const isAdminCode = allowedAdminCodes.split(",").includes(code);

      const verifyWardCode = container.getVerifyWardCode();
      const verifyWardCodeResponse = await verifyWardCode(code);

      if (!isAdminCode && !verifyWardCodeResponse.validWardCode) {
        res.statusCode = 401;
        res.end();
        return;
      }

      let token = undefined;
      const tokens = container.getTokenProvider();
      if (isAdminCode) {
        token = tokens.generate({
          wardId: undefined,
          wardCode: undefined,
          admin: true,
        });
      } else {
        const { ward } = verifyWardCodeResponse;
        token = tokens.generate({
          wardId: ward.id,
          wardCode: ward.code,
          admin: false,
        });
      }

      const expiryHours = 2;
      let expiry = new Date();
      if (isAdminCode) {
        expiry.setTime(expiry.getTime() + 1 * 60 * 60 * 1000);
      } else {
        expiry.setTime(expiry.getTime() + expiryHours * 60 * 60 * 1000);
      }

      res.writeHead(201, {
        "Set-Cookie": `token=${token}; httpOnly; path=/; expires=${expiry}`,
      });
      res.end(JSON.stringify({ wardId: code }));
      return;
    } else if (method === "DELETE") {
      const expired = new Date(0);

      res.writeHead(201, {
        "Set-Cookie": `token=''; httpOnly; path=/; expires=${expired}`,
      });
      res.end(JSON.stringify({ wardId: code }));
      return;
    } else {
      res.statusCode = 406;
      res.end();
      return;
    }
  }
);
