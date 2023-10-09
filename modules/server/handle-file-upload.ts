export async function handleFileUpload({
  request,
  path,
}: {
  request: Request;
  path: string;
}): Promise<string> {
  const file = Bun.file(path);
  if ((await file?.exists()) === true) {
    console.error("file already exists");
    return path;
  }

  //   const fileStream = fs.createWriteStream(path);
  const reader = request?.body?.getReader();
  file.writer().start;
  while (true) {
    // const { done, value } = await reader?.read();
    const readerData = await reader?.read();
    if (!readerData) {
      console.error("handleFileUpload", "readerData nto found");
      break;
    }

    const { done, value } = readerData;

    if (done) break;
    file.writer(value);
    // fileStream.write(value);
  }
  file.writer().end;
  //   fileStream.end();
  return path; // return the saved file path or some identifier
}
