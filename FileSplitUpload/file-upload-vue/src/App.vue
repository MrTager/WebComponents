<script setup lang="ts">
// import SparkMD5 from "spark-md5";
const uploadFile = (e: any) => {
  const file = e.target.files[0];
  if (!file) return;
  //直接计算文件hash值对不对得上
  // const spark = new SparkMD5.ArrayBuffer();
  // const reader = new FileReader();
  // reader.onload = (e: any) => {
  //   spark.append(e.target.result);
  //   console.log("直接计算", spark.end(), file.size);
  // };
  // reader.readAsArrayBuffer(file);

  //多线程分片
  createChunk(file);
};

const createChunk = (file: any) => {
  /**每一小片的大小 */
  const chunkSize = 1024 * 1024 * 3;
  console.log("分片大小", chunkSize);
  /**总共分成的小片数量 */
  const chunkCount = Math.ceil(file.size / chunkSize);
  /**获取CPU核心个数 */
  let threadCount = navigator.hardwareConcurrency || 4;
  /**每一个线程分到的小片数量 */
  let threadChunkCount = Math.ceil(chunkCount / threadCount);
  /**有序存储小分片 */
  let result: any = [];
  let responseCount: number = 0;
  /**for循环遍历小片个数 */
  for (let i = 0; i < threadCount; i++) {
    /**创建线程 */
    const thread = new Worker("/public/worker.js", {
      type: "module",
    });

    // console.log("============================================")
    // console.log("分片个数",chunkCount)
    // console.log("核心个数",threadCount)

    /**线程通信 将文件、小片大小、小片起始位置、小片结束位置 传给线程 */
    thread.postMessage({
      file,
      chunkSize,
      chunkArrStartIndex: i * threadChunkCount,
      chunkArrEndIndex: Math.min(
        i * threadChunkCount + threadChunkCount,
        chunkCount - 1
      ),
    });
    /**线程通信 通信结束销毁线程 */
    thread.onmessage = (e: any) => {
      responseCount++;
      e.data.forEach((it: any) => {
        result[it.index] = it;
      });
      if (responseCount !== threadCount) return;
      /**最终的分片结果 */
      console.log("最终result", result);
    };
  }
};
</script>

<template>
  <div>
    <input type="file" id="file" @change="uploadFile" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
