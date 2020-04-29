export default () => null;

export function getServerSideProps({ res }) {
  res.writeHead(301, {
    Location: "/wards/cancel-visit-confirmation",
  });
  res.end();
}
