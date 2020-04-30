import adminIsAuthenticated from "./adminIsAuthenticated";

export default function (callback, container) {
  return function (context) {
    const { req, res } = context;

    const authenticationToken = adminIsAuthenticated({
      getTokenProvider: () => container.tokens,
    })(req.headers.cookie);

    if (authenticationToken) {
      return callback({ ...context, authenticationToken }) ?? { props: {} };
    } else {
      res.writeHead(302, { Location: "/wards/login" }).end();
    }
  };
}
