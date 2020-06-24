import RandomIdProvider from "../RandomIdProvider";

class JitsiCallIdProvider {
  generate() {
    const ids = new RandomIdProvider();
    return ids.generate();
  }
}

export default JitsiCallIdProvider;
