import moment from "moment";

export default ({ getTokenProvider }) => (token) => {
  const expiresAt = new Date(token.exp * 1000);
  if (
    moment(moment()).isBetween(
      moment(expiresAt).subtract(3, "hours"),
      expiresAt
    )
  ) {
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
