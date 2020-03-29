let fileReader: FileReader;
export const handleFileSelect = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    if (!file) return;
    fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = fileReader.result as ArrayBuffer;
      if (!content?.byteLength) return;
      resolve(content as ArrayBuffer);
    };
    fileReader.readAsArrayBuffer(file);
  });
};
