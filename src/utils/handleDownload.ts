import { saveAs } from "file-saver";
export const handleDownload = async (uri: string, fileName: string) => {
  await fetch(uri, {
    method: "GET",
  })
    .then((res) => res.blob())
    .then((res) => {
      const blob = new Blob([res], {
        type: "application/octet-stream",
      });
      saveAs(blob, fileName);
    })
    .catch((err) => console.error(err));
};
