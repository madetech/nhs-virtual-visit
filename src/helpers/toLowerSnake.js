export default function toLowerSnake(value) {
  return value.toLowerCase().replace(/\W+/g, "-");
}
