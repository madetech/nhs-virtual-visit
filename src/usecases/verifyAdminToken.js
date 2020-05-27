import adminIsAuthenticated from "./adminIsAuthenticated";
import moment from "moment";

export default function (callback) {
  return function (context) {
    const { req, res, container } = context;

    const authenticationToken = adminIsAuthenticated(container)(
      req.headers.cookie
    );

    if (authenticationToken) {
      const expiresAt = new Date(authenticationToken.exp * 1000);
      if (
        moment(moment()).isBetween(
          moment(expiresAt).subtract(3, "hours"),
          expiresAt
        )
      ) {
        const tokenProvider = container.getTokenProvider();
        const refreshedEncToken = tokenProvider.generate({
          wardId: authenticationToken.wardId,
          wardCode: authenticationToken.wardCode,
          trustId: authenticationToken.trustId,
          type: authenticationToken.type,
        });
        res.setHeader("Set-Cookie", [
          `token=${refreshedEncToken}; httpOnly; path=/;`,
        ]);

        const refreshedToken = tokenProvider.validate(refreshedEncToken);

        return (
          callback({ ...context, authenticationToken: refreshedToken }) ?? {
            props: {},
          }
        );
      } else {
        return callback({ ...context, authenticationToken }) ?? { props: {} };
      }
    } else {
      res.writeHead(302, { Location: "/wards/login" }).end();
    }
  };
}
