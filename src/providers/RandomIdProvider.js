import { nanoid } from "nanoid";

class RandomIdProvider {
  generate(length = null) {
    if (length) {
      return nanoid(length);
    }

    return nanoid();
  }
}

export default RandomIdProvider;
