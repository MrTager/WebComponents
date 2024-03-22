export class ConcurrencyControl {
    constructor(maxConcurrent,fetchQueue) {
        this.maxConcurrent = maxConcurrent;
        this.fetchQueue = fetchQueue;
        this.runningRequests = [];
        this.finishedRequests = [];
    }
    async processQueue() {
        while (this.fetchQueue.length > 0) {
            while (this.runningRequests.length < this.maxConcurrent && this.fetchQueue.length > 0) {
                const req = this.fetchQueue.shift();
                console.log("队列长度",this.fetchQueue.length)
                const promise = req().then((e)=>{
                    this.finishedRequests.push(e);
                }).finally(() => {
                    this.runningRequests = this.runningRequests.filter(
                        runningRequest => runningRequest !== promise
                    );
                    console.log("结果",this.finishedRequests)
                });
                this.runningRequests.push(promise);
            }
            await Promise.race(this.runningRequests)
        }
    }
}

export const ConcurrencyControlFunc = async (maxConcurrent,fetchQueue) => {
    return new Promise(async (resolve,reject) => {
        try{
            let queueNum = fetchQueue.length;
            let runningRequests = [];
            let finishedRequests = [];
            while(fetchQueue.length > 0){
                while(runningRequests.length < maxConcurrent && fetchQueue.length > 0){
                    let req = fetchQueue.shift();
                    let promise = req().then((e)=>{
                        finishedRequests.push(e);
                    }).finally(()=>{
                        runningRequests = runningRequests.filter(fetch => fetch !== promise)
                        if(finishedRequests.length == queueNum){
                            resolve(finishedRequests);
                        }
                    });
                    runningRequests.push(promise);
                }
                await Promise.race(runningRequests)
            }
        }catch(e){
            reject(e)
        }
    })
}