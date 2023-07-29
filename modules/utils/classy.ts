type ClassName = string | number | boolean | null | undefined | ClassNameMap;
interface ClassNameMap {
  [key: string]: boolean | null | undefined;
}

/**
 * Generates a string of CSS class names based on the input arguments.
 *
 * @param {...ClassName} args - The input arguments of type 'ClassName'.
 * @returns {string} - The generated string of CSS class names.
 */
export function classy(...args: ClassName[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (arg == null) return;

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(arg.toString());
    } else if (arg instanceof Array) {
      classes.push(classy(...arg));
    } else if (typeof arg === "object") {
      Object.keys(arg).forEach((key) => {
        if (arg[key]) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(" ");
}

export default classy;
