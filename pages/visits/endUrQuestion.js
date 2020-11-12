//import React, { useEffect } from "react";
//import Layout from "../../src/components/Layout";
//import ActionLinkSection from "../../src/components/ActionLinkSection";
//import ActionLink from "../../src/components/ActionLink";
//import AnchorLink from "../../src/components/AnchorLink";
//import InsetText from "../../src/components/InsetText";
import propsWithContainer from "../../src/middleware/propsWithContainer";

export const getServerSideProps = propsWithContainer(
  async ({ req: { headers }, res, container, query }) => {
    const userIsAuthenticated = container.getUserIsAuthenticated();
    const token = await userIsAuthenticated(headers.cookie);

    if (token?.ward || null) {
      res
        .writeHead(302, { Location: `/visits/end?callId=${query.callId}` })
        .end();
    } else {
      res.status(200);
    }
  }
);
