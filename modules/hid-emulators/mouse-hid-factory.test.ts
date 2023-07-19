import { expect, test, describe } from "bun:test";
import { createMouseHIDFactory } from "./mouse-hid-factory";

describe("createMouseHIDFactory", () => {
  test("moveTo does not throw an error", () => {
    const mouseHIDFactory = createMouseHIDFactory();

    // We're not expecting this operation to throw an error.
    let errorOccurred = false;
    try {
      mouseHIDFactory.moveTo(100, 100);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBe(false);
  });

  test("leftClick does not throw an error", () => {
    const mouseHIDFactory = createMouseHIDFactory();

    // We're not expecting this operation to throw an error.
    let errorOccurred = false;
    try {
      mouseHIDFactory.leftClick();
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBe(false);
  });

  test("rightClick does not throw an error", () => {
    const mouseHIDFactory = createMouseHIDFactory();

    // We're not expecting this operation to throw an error.
    let errorOccurred = false;
    try {
      mouseHIDFactory.rightClick();
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBe(false);
  });
});
