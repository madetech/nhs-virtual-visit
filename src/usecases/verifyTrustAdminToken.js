import trustAdminIsAuthenticated from "./trustAdminIsAuthenticated";

export default function (callback) {
  return function (context) {
    const { req, res, container } = context;

    const authenticationToken = trustAdminIsAuthenticated(container)(
      req.headers.cookie
    );

    if (authenticationToken) {
      const {
        regeneratedToken,
        regeneratedEncodedToken,
        isTokenRegenerated,
      } = container.getRegenerateToken()(authenticationToken);

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
      return callback({ ...context, authenticationToken }) ?? { props: {} };
    } else {
      res.writeHead(302, { Location: "/" }).end();
      return { props: {} };
    }
  };
}
