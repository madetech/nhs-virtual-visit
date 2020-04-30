import "../src/global.scss";
import Head from "next/head";

export default ({ Component, pageProps }) => (
  <>
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
    <Component {...pageProps} />
  </>
);
