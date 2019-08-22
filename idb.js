//check for support
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }

  var db;
  var openRequest = indexedDB.open("olam_idb", 1);

  openRequest.onupgradeneeded = function(e) {
    var db = e.target.result;
    console.log("running onupgradeneeded");
    if (!db.objectStoreNames.contains("queries")) {
      var storeOS = db.createObjectStore("queries", { keyPath: "word" });
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

  function addItem(query, results) {
    var transaction = db.transaction(["queries"], "readwrite");
    var store = transaction.objectStore("queries");
    var existingItem = store.get(query);

    existingItem.onsuccess = e => {
      var date = new Date().getTime();
      var item;
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

      var request = store.put(item);

      request.onerror = e => {
        console.log("Error", e.target.error.name);
      };

      request.onsuccess = e => {
        console.log("Woot! Did it");
      };
    };

    existingItem.onerror = e => {
      console.log("Error", e.target.error.name);
    };
  }