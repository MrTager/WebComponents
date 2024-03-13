import SparkMD5 from 'spark-md5';

onmessage =async (e) => {
  // 获取传递的数据
  const data = e.data;
  const {chunkSize,file,chunkArrStartIndex,chunkArrEndIndex} = data;
  //对文件进行分片
  let result = [];
  for(let i = chunkArrStartIndex; i <= chunkArrEndIndex; i++){
    // console.log("我是线程开始位置",i)
      const sChunk = splitArrayByIndexAndCount(file,i,chunkSize);
      result.push(sChunk);
  }
  

  // console.log("文件总大小",file.size)
  // console.log('分片大小',chunkSize);
  // console.log("开始位置",chunkArrStartIndex);
  // console.log("结束位置",chunkArrEndIndex);


  // new Promise((resolve,reject) => {
  //   resolve(data);
  // }).then((data)=>{
    
  // })
  postMessage(await Promise.all(result) );
};

function splitArrayByIndexAndCount(file, startIndex, chunckSize) {
  return new Promise((resolve,reject) => {
    const start = startIndex*chunckSize
    const end = Math.min( start + chunckSize,file.size);
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const blob = file.slice(start,end);
    fileReader.onload = (e) => {
      spark.append(e.target.result);
      resolve({
        hash: spark.end(),
        index: startIndex,
        start,
        end,
        blob
      })
    }
    fileReader.readAsArrayBuffer(blob);
  })
}