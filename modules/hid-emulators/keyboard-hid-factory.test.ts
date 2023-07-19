import { describe, expect, test } from "bun:test";
import { createHIDKeyboardFactory } from "./keyboard-hid-factory";

describe("createHIDKeyboardFactory", () => {
  test("on registers and triggers a handler", async () => {
    const keypressFactory = createHIDKeyboardFactory();

    let keyHandled = false;
    keypressFactory.on("a", (key) => {
      expect(key).toBe("a");
      keyHandled = true;
    });

    keypressFactory.trigger("a");

    expect(keyHandled).toBe(true);
  });

  test("onMultiple registers and triggers a handler", async () => {
    const keypressFactory = createHIDKeyboardFactory();

    let keysHandled = false;
    keypressFactory.onMultiple(["a", "b"], (keys) => {
      expect(keys.sort()).toEqual(["a", "b"]);
      keysHandled = true;
    });

    keypressFactory.triggerMultiple(["a", "b"]);

    expect(keysHandled).toBe(true);
  });

  test("onWithModifier registers and triggers a handler", async () => {
    const keypressFactory = createHIDKeyboardFactory();

    let keyHandled = false;
    keypressFactory.onWithModifier("s", "Command", (key, modifier) => {
      expect(key).toBe("s");
      expect(modifier).toBe("Command");
      keyHandled = true;
    });

    keypressFactory.triggerWithModifier("s", "Command");

    expect(keyHandled).toBe(true);
  });
});
