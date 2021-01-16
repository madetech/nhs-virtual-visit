export default {
  getConnectionPool: jest.fn().mockReturnValue({
    request: jest.fn().mockReturnThis(),
    input: jest.fn().mockReturnThis(),
    query: jest.fn(() =>
      Promise.resolve({
        recordset: [],
      })
    ),
  }),
};
