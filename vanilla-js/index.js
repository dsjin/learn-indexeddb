function main() {

  // Check for support
  if (!('indexedDB' in window)) {
    console.log("This browser doesn't support IndexedDB.")
  }

  const request = window.indexedDB.open('test-db1', 1)
  
  request.onupgradeneeded = (ev) => {
    const upgradeDb = ev.target.result
    if (!upgradeDb.objectStoreNames.contains('people')) {
      // use email key path as a primary key
      const peopleOS = upgradeDb.createObjectStore('people', { keyPath: 'email' })
      peopleOS.createIndex('gender', 'gender', { unique: false })
      peopleOS.createIndex('ssn', 'ssn', { unique: true })
    }
    if (!upgradeDb.objectStoreNames.contains('notes')) {
      // generate a unique value for every object and store a primary key separately from data
      const notesOS = upgradeDb.createObjectStore('notes', { autoIncrement: true })
      notesOS.createIndex('title', 'title', { unique: false })
    }
    if (!upgradeDb.objectStoreNames.contains('logs')) {
      // generate a unique value for every object and store a primary key into id key path
      const logObjectStore = upgradeDb.createObjectStore('logs', { keyPath: 'id', autoIncrement: true })
      logObjectStore.add({
        msg: 'Error: Unknown Error'
      })
    }
  }

  request.onsuccess = (ev) => {
    const db = ev.target.result
    const logObjectStore = db.transaction('logs', 'readwrite').objectStore('logs')
    logObjectStore.getAll().onsuccess = (event) => {
      console.log(event.target.result)
    }
  }

}

main()
