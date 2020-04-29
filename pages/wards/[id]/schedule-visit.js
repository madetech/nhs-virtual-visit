import redirectWithQuery from "../../../src/helpers/redirectWithQuery";

export default () => null;

export const getServerSideProps = redirectWithQuery("/wards/schedule-visit");
