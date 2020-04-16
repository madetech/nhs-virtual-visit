import TokenProvider from '../../src/providers/TokenProvider';

const signingKey = process.env.JWT_SIGNING_KEY;
const allowedCodes = process.env.ALLOWED_CODES.split(',');
const tokens = new TokenProvider(signingKey);

export default ({ body: { code }, method }, res) => {
  if (method !== 'POST') {
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
  res.writeHead(201, { 'Set-Cookie': `token=${token}; httpOnly; path=/` }).end();
}
