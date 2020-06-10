import trustAdminIsAuthenticated from "./trustAdminIsAuthenticated";

export default function (callback) {
  return function (context) {
    const { req, res, container } = context;

    const authenticationToken = trustAdminIsAuthenticated(container)(
      req.headers.cookie
    );

    if (authenticationToken) {
      return callback({ ...context, authenticationToken }) ?? { props: {} };
    } else {
      res.writeHead(302, { Location: "/trust-admin/login" }).end();
    }
  };
}
