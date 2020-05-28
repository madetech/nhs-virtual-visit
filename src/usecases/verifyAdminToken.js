import adminIsAuthenticated from "./adminIsAuthenticated";
import regenerateToken from "./regenerateToken";

export default function (callback) {
  return function (context) {
    const { req, res, container } = context;

    const authenticationToken = adminIsAuthenticated(container)(
      req.headers.cookie
    );

    if (authenticationToken) {
      const {
        regeneratedToken,
        regeneratedEncodedToken,
        isTokenRegenerated,
      } = regenerateToken(container)(authenticationToken);

      if (isTokenRegenerated) {
        res.setHeader("Set-Cookie", [
          `token=${regeneratedEncodedToken}; httpOnly; path=/;`,
        ]);
        return (
          callback({ ...context, authenticationToken: regeneratedToken }) ?? {
            props: {},
          }
        );
      }
      return (
        callback({ ...context, authenticationToken }) ?? {
          props: {},
        }
      );
    } else {
      res.writeHead(302, { Location: "/wards/login" }).end();
    }
  };
}
