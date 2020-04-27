import TokenProvider from "../../src/providers/TokenProvider";

const signingKey = process.env.JWT_SIGNING_KEY;
const allowedCodes = process.env.ALLOWED_CODES.split(",");
const tokens = new TokenProvider(signingKey);

export default ({ body: { code }, method }, res) => {
  console.log("API was hit!");
  if (method !== "POST") {
    res.statusCode = 406;
    res.end();
    return;
  }

  console.log("Method was POST");
  if (!allowedCodes.includes(code)) {
    console.log(`${code} was not valid :(`);
    res.statusCode = 401;
    res.end();
    return;
  }

  console.log("Code was valid! Generating token...");

  const token = tokens.generate(code);

  console.log("Token generated!");
  const expiryHours = 2;
  let expiry = new Date();
  expiry.setTime(expiry.getTime() + expiryHours * 60 * 60 * 1000);

  console.log("Token expiry generated, making response...");
  res
    .writeHead(201, {
      "Set-Cookie": `token=${token}; httpOnly; path=/; expires=${expiry}`,
    })
    .end(JSON.stringify({ wardId: code }));
};
