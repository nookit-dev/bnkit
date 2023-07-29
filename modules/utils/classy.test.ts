import { expect, it } from "bun:test";
import classy from "../../_plugins/classy/index";
it("test single string argument", () => {
  expect(classy("hello")).toBe("hello");
});

it("test multiple string arguments", () => {
  expect(classy("hello", "world")).toBe("hello world");
});

it("test single number argument", () => {
  expect(classy(123)).toBe("123");
});

// Tests that passing a single boolean argument returns an empty string
it("test single boolean argument", () => {
  expect(classy(true)).toBe("");
});

it("test single null argument", () => {
  expect(classy(null)).toBe("");
});

it("test single undefined argument", () => {
  expect(classy(undefined)).toBe("");
});

it("test object classes", () => {
  expect(classy({ hello: true, world: false })).toBe("hello");
});
