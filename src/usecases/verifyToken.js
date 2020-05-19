import userIsAuthenticated from "./userIsAuthenticated";

export default function (callback) {
  return function (context) {
    const { req, res, container } = context;

    const authenticationToken = userIsAuthenticated(container)(
      req.headers.cookie
    );

    if (authenticationToken) {
      return callback({ ...context, authenticationToken }) ?? { props: {} };
    } else {
      res.writeHead(302, { Location: "/wards/login" }).end();
    }
  };
}
