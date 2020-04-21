import userIsAuthenticated from "./userIsAuthenticated";

export default function (callback, container) {
  return function (context) {
    const { req, res } = context;

    if (verifyTokenOrRedirect(req, res, container) === true) {
      return callback(context) ?? { props: {} };
    }
  };
}

export function verifyTokenOrRedirect(req, res, { tokens }) {
  const redirectToLogin = () => {
    res.writeHead(302, { Location: "/wards/login" }).end();
  };

  try {
    if (
      !userIsAuthenticated({ getTokenProvider: () => tokens })(
        req.headers.cookie
      )
    ) {
      return redirectToLogin();
    }

    return true;
  } catch (error) {
    return redirectToLogin();
  }
}
