import adminIsAuthenticated from "./adminIsAuthenticated";

export default function (callback) {
  return function (context) {
    const { req, res, container } = context;

    const authenticationToken = adminIsAuthenticated(container)(
      req.headers.cookie
    );

    if (authenticationToken) {
      return callback({ ...context, authenticationToken }) ?? { props: {} };
    } else {
      res.writeHead(302, { Location: "/wards/login" }).end();
    }
  };
}
