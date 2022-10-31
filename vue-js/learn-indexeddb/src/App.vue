<script setup lang="ts">
  import { ref, Ref, watch } from 'vue'
  import { useIndexedDb } from './composables/useIndexedDb'
  import { INote } from './assets/interface/Note'
  import NoteEntryModal from './components/NoteEntryModal.vue'
  const indexedDb = useIndexedDb()
  const allNote: Ref<INote[]> = ref([]) 
  const showModal: Ref<boolean> = ref(false)
  const onNoteAdded = () => {
    getAllNote()
    showModal.value = false
  }
    // const test = computed(() => indexedDb.db.value)
  const getAllNote = () => {
    allNote.value = []
    const noteObjectStore = indexedDb.db.value?.transaction('notes', 'readonly').objectStore('notes')
    noteObjectStore!.getAll().onsuccess = (ev: any) => {
      ev.target.result.forEach((element: any) => {
        allNote.value.push(
          {
            id: element.id,
            title: element.title,
            body: element.body,
            timestamp: element.timestamp,
          }
        )
      })
    }
  }
  watch(indexedDb.db, (value: any) => {
    if (value) {
      getAllNote()
    }
  })
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
  // import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <p
    style="font-size: 5em"
  >
    Note
  </p>
  <button
    @click="showModal = true"
  >
    Add new note
  </button>
  <ul
    style="list-style: None"
  >
    <li
      :key="note.id"
      v-for="note in allNote"
      style="font-size: 2em; margin-left: -1.2em; margin-top: 1.2em"
    >
      {{ note.title }}
    </li>
  </ul>
  <note-entry-modal :show-modal="showModal" @on-close="showModal = false" @on-add="onNoteAdded" />
</template>

<style scoped>
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
</style>
