import nookies from 'nookies';
import TokenProvider from '../../providers/TokenProvider';

const withAuth = (Component) => {
  const Authenticated = (props) => (<Component {...props} />);

  Authenticated.getInitialProps = async (context) => {
    if (!process.browser) {
      const { token } = nookies.get(context);
      console.log({ token });
      const tokens = new TokenProvider(process.env.JWT_SIGNING_KEY);
  
      if (!token || !tokens.validate(token)) {
        if (context.res) {
          context.res.writeHead(302, {
            Location: '/wards/login'
          });
  
          return context.res.end();
        }
      }
  
      const pageProps = Component.getInitialProps && await Component.getInitialProps(context);
      return { ...pageProps };
    } else {
      console.log("NOT BROWSER");
    }
  };

  return Authenticated;
};

export default withAuth;
