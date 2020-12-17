import WherebyCallIdProvider from "./callIdProviders/WherebyCallIdProvider";

const WHEREBY = "whereby";

export const VIDEO_PROVIDERS = [WHEREBY];

export const VIDEO_PROVIDER_OPTIONS = [{ id: WHEREBY, name: "Whereby" }];

class CallIdProvider {
  constructor(provider, callTime = null) {
    this.provider = provider;
    this.callTime = callTime;
  }

  async generate() {
    let callIdProvider = null;

    switch (this.provider) {
      case WHEREBY:
        callIdProvider = new WherebyCallIdProvider(this.callTime);
        break;
      default:
        throw `Provider ${this.provider} not supported`;
    }

    return await callIdProvider.generate();
  }
}

export default CallIdProvider;
