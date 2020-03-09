export default class IndexedDB {
  constructor(keyPath, ...storeColumnsNames) {
    this.db = {};
    this._dbName = "spreadsheetdb";
    this._storeColumnsNames = storeColumnsNames;
    this._keyPath = keyPath;
    this._serviceWorking = false;

    this._initializeDB();
    this._createDBConection();
  }

  /**
   * Set configuration DB on window
   */
  _initializeDB = () => {
    //prefixes of window.IDB objects
    window.IDBTransaction = window.IDBTransaction
      || window.webkitIDBTransaction
      || window.msIDBTransaction;

    window.IDBKeyRange = window.IDBKeyRange
      || window.webkitIDBKeyRange
      || window.msIDBKeyRange;

    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB.");
    }
  }

  /**
   * Create the DB contexto
   */
  _createDBConection = () => {
    const request = window.indexedDB.open(this._dbName, 1);

    request.onerror = (event) => {
      console.log("error: ", event);
    };

    request.onsuccess = (event) => {
      this.db = request.result;
      this._serviceWorking = true;
    };

    request.onupgradeneeded = (event) => {
      this.db = event.target.result;

      for (let name of this._storeColumnsNames) {
        this.db.createObjectStore(name, { keyPath: this._keyPath });
      }
    };
  }

  /**
   * This method will get a collection of data.
   * 
   * @param {*} storeName Colletion what you want
   * @param {*} callback Method will call after search is done. This method will reseve the result.
   */
  searchValues = (storeName, callback) => {
    if (!this._serviceWorking) {
      setTimeout(() => {
        this.searchValues(storeName, callback);
      }, 1000)
    } else {
      const objectStore = this.db
        .transaction([storeName])
        .objectStore(storeName);
      let result = [];

      objectStore.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        }
        else {
          callback && callback(result);
        }
      };
    }
  }

  /**
   * Add a object in a specific store
   * 
   * @param {*} storeName Name for the store
   * @param {*} item Object to add 
   * @param {*} onSucess Callback if success
   * @param {*} onError Callback if something is wrong 
   */
  addItem = (storeName, item, onSucess, onError) => {
    let request = this.db
    .transaction([storeName], "readwrite")
    .objectStore(storeName)
    .add(item);

    request.onsuccess = (event) => {
      onSucess && onSucess();
    };

    request.onerror = (event) => {
      onError && onError(event);
    }
  }

  /**
   * Add a colletion of data in a specific store
   * 
   * @param {*} storeName Name for the store
   * @param {*} array An collection of date
   * @param {*} onSucess Callback if success
   * @param {*} onError Callback if something is wrong 
   */
  addItens = (storeName, array, onSucess, onError) => {
    for (let obj of array) {
      this.addItem(storeName, obj, onSucess, onError);
    }
  }

  /**
   * Update a object in a specific store
   * 
   * @param {*} storeName Name for the store
   * @param {*} obj Object to updated 
   * @param {*} onSucess Callback if success
   * @param {*} onError Callback if something is wrong 
   */
  updateItem = (storeName, obj, onSucess, onError) => {
    let request = this.db
        .transaction([storeName], "readwrite")
        .objectStore(storeName, obj.id)
        .put(obj);

      request.onerror = (event) => {
        onError && onError(event);
      };

      request.onsuccess = (event) => {
        onSucess && onSucess();
      };
  }

  /**
   * Collection of date to update in a specific store
   * 
   * @param {*} storeName Name for the store
   * @param {*} array Array of date to update 
   * @param {*} onSucess Callback if success
   * @param {*} onError Callback if something is wrong 
   */
  updateItens = (storeName, array, onSucess, onError) => {
    for (let obj of array) {
      this.updateItem(storeName, obj, onSucess, onError);
    }
  }

  /**
   * Remove a particuar date in a specific store
   * 
   * @param {*} storeName Name for the store
   * @param {*} obj Object to delete 
   * @param {*} onSucess Callback if success
   * @param {*} onError Callback if something is wrong 
   */
  remove(storeName, obj, onSucess, onError) {
    var request = this.db
      .transaction([storeName], "readwrite")
      .objectStore(storeName)
      .delete(obj);

    request.onsuccess = (event) => {
      onSucess && onSucess();
    };

    request.onerror = (event) => {
      onError && onError(event);
    };
  }

  /**
   * Remove all date from the specific store
   * 
   * @param {*} storeName Name for the store
   * @param {*} onSucess Callback if success
   * @param {*} onError Callback if something is wrong 
   */
  removeAll(storeName, onSucess, onError) {
    var request = this.db
      .transaction([storeName], "readwrite")
      .objectStore(storeName)
      .clear();

    request.onsuccess = (event) => {
      onSucess && onSucess();
    };

    request.onerror = (event) => {
      onError && onError(event);
    };
  }
}