import cookie from "cookie";

export default function (callback, { tokens }) {
  return function (context) {
    const { req, res } = context;
    const redirectToLogin = () => {
      res.writeHead(302, { Location: "/wards/login" }).end();
    };

    try {
      const { token } = cookie.parse(req.headers.cookie);

      if (!token || !tokens.validate(token)) {
        return redirectToLogin();
      }

      return callback(context);
    } catch (error) {
      return redirectToLogin();
    }
  };
}
