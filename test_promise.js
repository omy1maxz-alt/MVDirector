const p = Promise.reject(new Error("test"));
p.catch(() => console.log("caught internally"));
// no catch on p directly from the "user"
setTimeout(() => console.log("done"), 100);
