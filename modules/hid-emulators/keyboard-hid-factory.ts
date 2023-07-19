import { spawn } from "child_process";

type KeyHandler = (key: string) => void;
type KeyComboHandler = (keys: string[]) => void;
type KeyModifierHandler = (key: string, modifier: string) => void;

export function createHIDKeyboardFactory() {
  const handlers: { [key: string]: KeyHandler[] } = {};
  const comboHandlers: { [keys: string]: KeyComboHandler[] } = {};
  const modifierHandlers: {
    [key: string]: { [modifier: string]: KeyModifierHandler[] };
  } = {};

  const bashScript = `
    stty raw
    key=$(dd bs=1 count=1 2>/dev/null)
    echo $key
    stty -raw
  `;

  const proc = spawn("bash", ["-c", bashScript]);

  proc.stdout.on("data", (data) => {
    const key = data.toString().trim();
    if (handlers[key]) {
      handlers[key].forEach((handler) => handler(key));
    }
  });

  return {
    on: (key: string, handler: KeyHandler) => {
      if (!handlers[key]) {
        handlers[key] = [];
      }
      handlers[key].push(handler);
    },
    onMultiple: (keys: string[], handler: KeyComboHandler) => {
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
      if (!modifierHandlers[key]) {
        modifierHandlers[key] = {};
      }
      if (!modifierHandlers[key][modifier]) {
        modifierHandlers[key][modifier] = [];
      }
      modifierHandlers[key][modifier].push(handler);
    },
    trigger: (key: string) => {
      if (handlers[key]) {
        handlers[key].forEach((handler) => handler(key));
      }
    },
    triggerMultiple: (keys: string[]) => {
      const keyCombo = keys.sort().join(",");
      if (comboHandlers[keyCombo]) {
        comboHandlers[keyCombo].forEach((handler) => handler(keys));
      }
    },
    triggerWithModifier: (key: string, modifier: string) => {
      if (modifierHandlers[key] && modifierHandlers[key][modifier]) {
        modifierHandlers[key][modifier].forEach((handler) =>
          handler(key, modifier)
        );
      }
    },
  };
}
