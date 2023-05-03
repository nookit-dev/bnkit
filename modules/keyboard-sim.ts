type KeyCombination = {
  modifiers: Array<"ctrl" | "alt" | "shift">;
  key: string;
};

export function parseShortcut(shortcut: string): KeyCombination {
  const parts = shortcut.split("+");
  const modifiers: Array<"ctrl" | "alt" | "shift"> = [];

  parts.forEach((part) => {
    if (["ctrl", "alt", "shift"].includes(part.toLowerCase())) {
      modifiers.push(part.toLowerCase() as "ctrl" | "alt" | "shift");
    }
  });

  const key = parts[parts.length - 1];
  return { modifiers, key };
}

export function triggerKeyCombination(combination: KeyCombination): void {
  // Simulate pressing the key combination
  console.log(
    `Simulating key combination: ${combination.modifiers.join("+")}${
      combination.modifiers.length ? "+" : ""
    }${combination.key}`
  );
  // Replace the above line with actual implementation using a third-party library or native Node.js addon
}

export function triggerShortcut(shortcut: string): void {
  const combination = parseShortcut(shortcut);
  triggerKeyCombination(combination);
}

export function triggerKeySequence(sequence: string): void {
  for (const key of sequence) {
    triggerKeyCombination({ modifiers: [], key });
  }
}
