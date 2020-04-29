import queryString from "query-string";

export default (path) => ({ res, query }) => {
  const uri = queryString.stringifyUrl({
    url: path,
    query,
  });
  res.writeHead(301, {
    Location: uri,
  });
  res.end();
};
