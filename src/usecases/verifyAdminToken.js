import adminIsAuthenticated from "./adminIsAuthenticated";
import refreshToken from "./refreshToken";

export default function (callback) {
  return function (context) {
    const { req, res, container } = context;

    const authenticationToken = adminIsAuthenticated(container)(
      req.headers.cookie
    );

    if (authenticationToken) {
      const {
        refreshedToken,
        refreshedEncodedToken,
        isTokenRefreshed,
      } = refreshToken(container)(authenticationToken);

      if (isTokenRefreshed) {
        res.setHeader("Set-Cookie", [
          `token=${refreshedEncodedToken}; httpOnly; path=/;`,
        ]);
        return (
          callback({ ...context, authenticationToken: refreshedToken }) ?? {
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
