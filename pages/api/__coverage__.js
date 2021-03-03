module.exports = (req, res) => {
  // only GET is supported
  res.status(200).json({
    coverage: global.__coverage__ || null
  })
}
