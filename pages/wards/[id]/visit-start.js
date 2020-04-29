import queryString from "query-string";

export default () => null;

export function getServerSideProps({ res, query }) {
  const uri = queryString.stringifyUrl({
    url: "/wards/visit-start",
    query,
  });
  res.writeHead(301, {
    Location: uri,
  });
  res.end();
}
