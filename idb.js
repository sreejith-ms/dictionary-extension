//check for support
//   if (!("indexedDB" in window)) {
//     console.log("This browser doesn't support IndexedDB");
//     return;
//   }

let db;

const init = () => {
  const openRequest = indexedDB.open("olam_idb", 1);
  openRequest.onupgradeneeded = function(e) {
    const db = e.target.result;
    console.log("running onupgradeneeded");
    if (!db.objectStoreNames.contains("queries")) {
      db.createObjectStore("queries", { keyPath: "word" });
    }
  };
  openRequest.onsuccess = function(e) {
    console.log("running onsuccess");
    db = e.target.result;
  };
  openRequest.onerror = function(e) {
    console.log("onerror!");
    console.dir(e);
  };
};

const addToStore = (query, results) => {
  const transaction = db.transaction(["queries"], "readwrite");
  const store = transaction.objectStore("queries");
  const existingItem = store.get(query);
  existingItem.onsuccess = e => {
    const date = new Date().getTime();
    let item;
    if (!existingItem.result) {
      item = {
        word: query,
        definition: results,
        ts: [date],
        occurance: 1
      };
    } else {
      existingItem.result.ts.push(date);
      existingItem.result.occurance += 1;
      item = existingItem.result;
    }
    const request = store.put(item);
    request.onerror = e => {
      console.error("Error", e.target.error.name);
    };
    request.onsuccess = e => {
      console.log("Woot! Did it");
    };
  };
  existingItem.onerror = e => {
    console.error("Error", e.target.error.name);
  };
};

init();

export { addToStore };
