import React from "react";

function LoginRedirect() {
  return <div></div>;
}

export function getServerSideProps({ res }) {
  res.writeHead(301, {
    Location: "/wards/login",
  });
  res.end();
}

export default LoginRedirect;
