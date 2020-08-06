import JitsiCallIdProvider from "./callIdProviders/JitsiCallIdProvider";
import WherebyCallIdProvider from "./callIdProviders/WherebyCallIdProvider";

const WHEREBY = "whereby";
const JITSI = "jitsi";

export const VIDEO_PROVIDERS = [WHEREBY, JITSI];

export const VIDEO_PROVIDER_OPTIONS = [
  { id: WHEREBY, name: "Whereby" },
  { id: JITSI, name: "Jitsi" },
];

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
      case JITSI:
        callIdProvider = new JitsiCallIdProvider();
        break;
      default:
        throw `Provider ${this.provider} not supported`;
    }

    return await callIdProvider.generate();
  }
}

export default CallIdProvider;
