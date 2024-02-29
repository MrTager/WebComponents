<script setup lang="ts">

const uploadFile = (e: any) => {
  const file = e.target.files[0]
  if(!file) return;
  //多线程分片
  createChunk(file)
}

const createChunk = (file: any) => {
  const chunkSize = 1024 * 1024 * 3;
  const chunkCount = Math.ceil(file.size / chunkSize);
  //获取CPU核心个数
  let threadCount = navigator.hardwareConcurrency || 4;
  let startIndex = 0;
  let endIndex = 0;
  if(threadCount > chunkCount){
    threadCount = Math.ceil(chunkCount/threadCount);
  }
  for (let i = 0; i < threadCount; i++) {
    //创建线程
    const thread = new Worker('./worker.js',{
      type: 'module'
    });
    //当前分片起始位置
    if((i+1)*(chunkCount/threadCount) < chunkCount){
      endIndex = startIndex + Math.ceil((chunkCount/threadCount)) - 1;
    }else{
      endIndex = chunkCount - 1;
    }
    
    console.log("============================================")
    console.log("分片个数",chunkCount)
    console.log("核心个数",threadCount)
    console.log("当前线程分片开始位置",startIndex,"结束位置",endIndex)

    thread.postMessage({
      file,
      chunkSize,
      startIndex,
      endIndex
    });
    thread.onmessage = (e: any) => {
      console.log(e.data);
    }
    startIndex = endIndex + 1;
  }

}



</script>

<template>
  <div>
   <input type="file" id="file" @change="uploadFile">
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
