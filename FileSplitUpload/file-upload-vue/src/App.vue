<script setup lang="ts">

const uploadFile = (e: any) => {
  const file = e.target.files[0]
  if(!file) return;
  console.log(createChunk(file));
  //多线程分片
  
}

const createChunk = (file: any) => {
  const chunkSize = 1024 * 1024 * 1;
  const chunks = [];
  let currentChunk = 0;
  while (currentChunk < file.size) {
    chunks.push(file.slice(currentChunk, currentChunk + chunkSize));
    currentChunk += chunkSize;
  }
  return chunks;
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
