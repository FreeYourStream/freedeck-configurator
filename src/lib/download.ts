export const download = (data: Buffer) => {
  var a = document.createElement("a");
  document.body.appendChild(a);
  const blob = new Blob([data], { type: "octet/stream" });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = "uff.bin";
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};
