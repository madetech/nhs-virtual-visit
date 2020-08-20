import React from "react";
import App from "next/app";
import * as Sentry from "@sentry/node";
import Head from "next/head";

Sentry.init({
  enabled: process.env.ENABLE_SENTRY === "yes",
  environment: process.env.APP_ENV || process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    // Workaround for https://github.com/zeit/next.js/issues/8592
    const { err } = this.props;
    const modifiedPageProps = { ...pageProps, err };

    return (
      <>
        <Head lang="en">
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Component {...modifiedPageProps} />
      </>
    );
  }
}

export default MyApp;
