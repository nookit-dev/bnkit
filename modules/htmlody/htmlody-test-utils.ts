import { Attributes, JsonTagElNode } from ".";

export function randomAttributes(): Attributes {
  return {
    id: `id-${Math.floor(Math.random() * 1000)}`,
    class: `class-${Math.floor(Math.random() * 1000)}`,
  };
}

export function randomTagElement(): JsonTagElNode {
  return {
    tag: `tag-${Math.floor(Math.random() * 1000)}`,
    attributes: randomAttributes(),
    content: `content-${Math.floor(Math.random() * 1000)}`,
  };
}
