// Import the spawn function from the child_process module
import { spawn } from "child_process";

// Define type aliases for our various handler functions
type KeyHandler = (key: string) => void;
type KeyComboHandler = (keys: string[]) => void;
type KeyModifierHandler = (key: string, modifier: string) => void;

// This function creates and returns an object that allows you to
// bind handlers to specific keyboard events
export function createHIDKeyboardFactory() {
  // These objects will store our handlers, indexed by key or key combination
  const handlers: { [key: string]: KeyHandler[] } = {};
  const comboHandlers: { [keys: string]: KeyComboHandler[] } = {};
  const modifierHandlers: {
    [key: string]: { [modifier: string]: KeyModifierHandler[] };
  } = {};

  // This bash script will be used to listen for keypresses
  const bashScript = `
    stty raw
    key=$(dd bs=1 count=1 2>/dev/null)
    echo $key
    stty -raw
  `;

  // We create a child process that runs the above bash script
  const proc = spawn("bash", ["-c", bashScript]);

  // When the process outputs data (i.e., a keypress), we call all relevant handlers
  proc.stdout.on("data", (data) => {
    const key = data.toString().trim();
    if (handlers[key]) {
      handlers[key].forEach((handler) => handler(key));
    }
  });

  // The object we return has methods for binding handlers to events and triggering events manually
  return {
    on: (key: string, handler: KeyHandler) => {
      // This method binds a handler to a specific key
      if (!handlers[key]) {
        handlers[key] = [];
      }
      handlers[key].push(handler);
    },
    onMultiple: (keys: string[], handler: KeyComboHandler) => {
      // This method binds a handler to a specific combination of keys
      const keyCombo = keys.sort().join(",");
      if (!comboHandlers[keyCombo]) {
        comboHandlers[keyCombo] = [];
      }
      comboHandlers[keyCombo].push(handler);
    },
    onWithModifier: (
      key: string,
      modifier: string,
      handler: KeyModifierHandler
    ) => {
      // This method binds a handler to a specific key with a modifier (like shift, ctrl, etc.)
      if (!modifierHandlers[key]) {
        modifierHandlers[key] = {};
      }
      if (!modifierHandlers[key][modifier]) {
        modifierHandlers[key][modifier] = [];
      }
      modifierHandlers[key][modifier].push(handler);
    },
    trigger: (key: string) => {
      // This method manually triggers the event for a specific key
      if (handlers[key]) {
        handlers[key].forEach((handler) => handler(key));
      }
    },
    triggerMultiple: (keys: string[]) => {
      // This method manually triggers the event for a specific combination of keys
      const keyCombo = keys.sort().join(",");
      if (comboHandlers[keyCombo]) {
        comboHandlers[keyCombo].forEach((handler) => handler(keys));
      }
    },
    triggerWithModifier: (key: string, modifier: string) => {
      // This method manually triggers the event for a specific key with a modifier
      if (modifierHandlers[key] && modifierHandlers[key][modifier]) {
        modifierHandlers[key][modifier].forEach((handler) =>
          handler(key, modifier)
        );
      }
    },
  };
}
