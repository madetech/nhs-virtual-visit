import { customAlphabet } from "nanoid";

class RandomIdProvider {
  generate() {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    return nanoid();
  }
}

export default RandomIdProvider;
