import { ref, onMounted, Ref } from 'vue'

export function useIndexedDb() {
  const db: Ref<IDBDatabase | null> = ref(null)
  const initDb = () => {
    if (window) {
      if (!('indexedDB' in window)) {
        console.log("This browser doesn't support IndexedDB.")
      }
      const request: IDBOpenDBRequest = window.indexedDB.open('test-db-vue', 1)
      request.onsuccess = (ev: any) => {
        db.value = ev.target.result
      }
      request.onerror = (ev: any) => {
        console.error(`Database error: ${ev.target.errorCode}`)
      }
      request.onblocked = (ev: any) => {
        console.log('Please close all other tabs with this site open!')
      }
      request.onupgradeneeded = (ev: any) => {
        const upgradeDb = ev.target.result
        if (!upgradeDb.objectStoreNames.contains('notes')) {
          // generate a unique value for every object and store a primary key separately from data
          const notesOS = upgradeDb.createObjectStore('notes', { keyPath: 'id', autoIncrement: true })
          notesOS.createIndex('title', 'title', { unique: false })
        }
      }
    }
  }
  onMounted(() => {
    initDb()
  })
  return {
    db
  }
}
