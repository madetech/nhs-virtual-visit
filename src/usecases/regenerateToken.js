import moment from "moment";

export default ({ getTokenProvider }) => (token) => {
  const expiresAt = moment.unix(token.exp);
  if (moment().isBetween(moment(expiresAt).subtract(3, "hours"), expiresAt)) {
    const tokenProvider = getTokenProvider();
    const regeneratedEncodedToken = tokenProvider.generate({
      wardId: token.wardId,
      wardCode: token.wardCode,
      trustId: token.trustId,
      type: token.type,
    });

    const regeneratedToken = tokenProvider.validate(regeneratedEncodedToken);
    return {
      regeneratedToken,
      regeneratedEncodedToken,
      isTokenRegenerated: true,
    };
  } else {
    return { isTokenRegenerated: false };
  }
};
