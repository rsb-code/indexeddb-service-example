import IndexedDB from '../_config/indexeddb';

export default class SpreadsheetLocalService {
  constructor() {
    this._storeColumnsName = "columns";
    this._storeLinesName = "lines";
    this._keyPath = "id";

    this.indexedDb = new IndexedDB(this._keyPath, this._storeColumnsName, this._storeLinesName);
  }

  getColumns = (callback) => {
    this.indexedDb.searchValues(this._storeColumnsName, callback);
  }

  getLines = (callback) => {
    this.indexedDb.searchValues(this._storeLinesName, callback);
  }

  addColumns = (array, onSucess, onError) => {
    this.indexedDb.addItens(this._storeColumnsName, array, onSucess, onError);
  }

  addLines = (array, onSucess, onError) => {
    this.indexedDb.addItens(this._storeLinesName, array, onSucess, onError);
  }

  updateColumns = (array, onSucess, onError) => {
    this.indexedDb.updateItens(this._storeColumnsName, array, onSucess, onError);
  }

  updateLines = (array, onSucess, onError) => {
    this.indexedDb.updateItens(this._storeLinesName, array, onSucess, onError);
  }
}