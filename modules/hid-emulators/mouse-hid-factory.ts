import { spawn } from "child_process";


// TODO there seems to be something wrong with this modules
export function createMouseHIDFactory() {
  return {
    moveTo: (x: number, y: number) => {
      // TODO this needs to be replaced, I need to do something like spawn C++ file
      // for example:
      `
      #include <ApplicationServices/ApplicationServices.h>

void MoveMouse(float x, float y)
{
    // Create an event to represent the mouse moving
    CGPoint newLoc = CGPointMake(x, y);
    CGEventRef moveEvent = CGEventCreateMouseEvent(
        NULL, // default event source
        kCGEventMouseMoved,
        newLoc,
        kCGMouseButtonLeft // ignored because the mouse isn't being clicked
    );

    // Post the event
    CGEventPost(kCGHIDEventTap, moveEvent);

    // Release the event
    CFRelease(moveEvent);
}

int main(int argc, const char * argv[]) {
    MoveMouse(100, 100);
    return 0;
}
`;
      const script = `
        tell application "System Events"
          do shell script "/usr/bin/env python -c \\"import Quartz;Quartz.CGEventPost(Quartz.kCGHIDEventTap, Quartz.CGEventCreateMouseEvent(None, Quartz.kCGEventMouseMoved, Quartz.CGPointMake(${x},${y}), Quartz.kCGMouseButtonLeft))\\""
        end tell
      `;
      const proc = spawn("osascript", ["-e", script]);
      proc.on("error", (error) => {
        console.error(`Error moving mouse to (${x}, ${y}): ${error.message}`);
      });
    },
    leftClick: () => {
      const script = `
        tell application "System Events"
          click at {0, 0}
        end tell
      `;
      const proc = spawn("osascript", ["-e", script]);
      proc.on("error", (error) => {
        console.error(`Error clicking left mouse button: ${error.message}`);
      });
    },
    rightClick: () => {
      const script = `
        tell application "System Events"
          key down {command}
          click at {0, 0}
          key up {command}
        end tell
      `;
      const proc = spawn("osascript", ["-e", script]);
      proc.on("error", (error) => {
        console.error(`Error clicking right mouse button: ${error.message}`);
      });
    },
  };
}
