// 监听消息事件
onmessage = (e) => {
  // 获取传递的数据
  const data = e.data;
  
  // TODO 在此处进行数据的处理,并返回结果
  // 模拟数据处理
  setTimeout(() => {    
    // 将处理结果发送给主线程
    postMessage(data);
  }, 1000);
};
