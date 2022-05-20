import SparkMD5 from "spark-md5";

export function getFileMd5(file: File, chunkSize: number = 4096) {
  return new Promise((resolve, reject) => {
    const chunks = Math.ceil(file.size / chunkSize);
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    let currentChunk = 0;

    fileReader.onload = (e) => {
      typeof e?.target?.result === "object" &&
        e.target.result instanceof ArrayBuffer &&
        spark.append(e.target.result);

      ++currentChunk < chunks ? loadNext() : resolve(spark.end());
    };

    fileReader.onerror = (e) => reject(e);

    function loadNext() {
      let start = currentChunk * chunkSize;
      let end = start + chunkSize;
      if (end >= file.size) end = file.size;

      fileReader.readAsArrayBuffer(file.slice(start, end));
    }

    loadNext();
  });
}

export function getTxtMd5(txt: string) {
  return SparkMD5.hash(txt);
}
