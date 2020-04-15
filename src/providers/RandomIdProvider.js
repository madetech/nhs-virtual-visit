import { nanoid } from 'nanoid';

class RandomIdProvider {
  generate() {
    return nanoid();
  }
}

export default RandomIdProvider;
