const BASE_URL = "https://eyefyre.github.io/civvapi/v1/en";

// e.g. category: buildings item: courthouse
export default function buildUrl(category, item) {
  return `${BASE_URL}/${category}/${item}.json`;
}
