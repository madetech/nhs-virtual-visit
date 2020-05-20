import userIsAuthenticated from "./userIsAuthenticated";

export default function (callback) {
  return async function (context) {
    const { req, res, container } = context;

    const authenticationToken = await userIsAuthenticated(container)(
      req.headers.cookie
    );

    if (authenticationToken) {
      return callback({ ...context, authenticationToken }) ?? { props: {} };
    } else {
      res.writeHead(302, { Location: "/wards/login" }).end();
    }
  };
}
