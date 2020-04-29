export default () => null;

export function getServerSideProps({ res }) {
  res.writeHead(301, {
    Location: "/wards/schedule-success",
  });
  res.end();
}
