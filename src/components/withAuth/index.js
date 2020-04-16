import nookies from "nookies";
import TokenProvider from "../../providers/TokenProvider";

const withAuth = (Component) => {
  const Authenticated = (props) => <Component {...props} />;

  Authenticated.getInitialProps = async (context) => {
    if (!process.browser) {
      const { token } = nookies.get(context);
      const tokens = new TokenProvider(process.env.JWT_SIGNING_KEY);

      if (!token || !tokens.validate(token)) {
        if (context.res) {
          context.res.writeHead(302, {
            Location: "/wards/login",
          });

          return context.res.end();
        }
      }

      const pageProps =
        Component.getInitialProps && (await Component.getInitialProps(context));
      return { ...pageProps };
    }
  };

  return Authenticated;
};

export default withAuth;
