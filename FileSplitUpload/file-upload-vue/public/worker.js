import SparkMD5 from 'spark-md5';

onmessage = (e) => {
  // 获取传递的数据
  const data = e.data;
  const {chunkSize,file,startIndex,endIndex} = data;
  //对文件进行分片

  // let chunkArray = [];
  // const currentChunk = file.slice(startIndex*chunkSize,endIndex ? endIndex*chunkSize : chunkSize);
  // const currentChunkCount = endIndex ?  endIndex - startIndex : 1;

  // for(let i = 0; i < currentChunkCount; i++){
  //   chunkArray.push(currentChunk.slice(i*chunkSize,endIndex ? endIndex*chunkSize : chunkSize));
  // }

  let chunkArray = [];
  if(endIndex !== 0){
    chunkArray =  splitArrayByIndexAndCount(file,startIndex*chunkSize,(endIndex - startIndex)*chunkSize);
  }else{
    chunkArray =  file.slice(startIndex*chunkSize);
  }
  

  console.log("文件总大小",file.size)
  console.log('分片大小',chunkArray);
  console.log("文件",data)

  new Promise((resolve,reject) => {
    resolve(data);
  }).then((data)=>{
    postMessage(data);
  })
};

function splitArrayByIndexAndCount(file, startIndex, count) {
  // 验证输入参数的有效性
  if (startIndex < 0 || count <= 0 || startIndex >= file.size) {
    return [];
  }

  // 计算结束索引，保证不会超过数组长度
  const endIndex = Math.min(startIndex + count, file.size-1);

  // 使用slice方法返回子数组
  console.log("第",startIndex,"到",endIndex)
  return file.slice(startIndex, endIndex);
}