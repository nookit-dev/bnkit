type ClassName = string | number | boolean | null | undefined | ClassNameMap;
interface ClassNameMap {
  [key: string]: boolean | null | undefined;
}

export function classy(...args: ClassName[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return;

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      classes.push(classy(...arg));
    } else if (typeof arg === "object") {
      for (const key in arg) {
        if (arg[key]) {
          classes.push(key);
        }
      }
    }
  });

  return classes.join(" ");
}

export default classy;
