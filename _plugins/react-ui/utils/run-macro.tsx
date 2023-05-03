export async function runMacro({
  enterAfterText,
  hotkeys,
  text,
}: {
  hotkeys?: string[];
  text?: string;
  enterAfterText?: boolean;
}) {
  try {
    console.info("Running Macro");

    console.info({
      hotkeys,
      text,
      enterAfterText,
    });

    const submitData = {
      hotkeys: hotkeys?.join(",") || "",
      text: text || "",
      enterAfterText: (enterAfterText || false).toString(),
    };

    console.info({ submitData });

    // return promise so it can be awaited in the
    return await fetch("/api/run-macro", {
      method: "POST",
      body: JSON.stringify(submitData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
}
