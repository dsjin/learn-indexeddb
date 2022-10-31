<script setup lang="ts">
  import { ref, Ref, watch } from 'vue'
  import { useIndexedDb } from '../composables/useIndexedDb'
  import { INoteEntry } from '../assets/interface/Note'
  const props = defineProps({
    showModal : {
      type: Boolean,
      required: true,
      default: false
    }
  })
  const emit = defineEmits(['onClose', 'onAdd'])
  const indexedDb = useIndexedDb()
  const entryNote: Ref<INoteEntry> = ref({
    title: '',
    body: ''
  })
  const addNote = () => {
    const noteObjectStore = indexedDb.db.value?.transaction('notes', 'readwrite').objectStore('notes')
    noteObjectStore?.add({
      title: entryNote.value.title,
      body: entryNote.value.body,
      timestamp: new Date().getTime()
    })
    emit('onAdd')
  }
  watch(() => props.showModal, (value) => {
    if (!value) {
      entryNote.value = {
        title: '',
        body: ''
      }
    }
  })
</script>

<template>
  <div
    id="entryModalContainer"
    class="fade"
    :class="{show: showModal}"
  >
    <div
        class="modal-box"
    >
      <button
        style="position:absolute; right: 0.7em;"
        @click="$emit('onClose')"
      >
        X
      </button>
      <h2>
        Add Note
      </h2>
      <div
        class="modal-content-input"
      >
        <p>Title</p>
        <input v-model="entryNote.title" />
      </div>
      <div
        class="modal-content-input"
        style="margin-top:1.2em"
      >
        <p>Body</p>
        <textarea v-model="entryNote.body"></textarea>
      </div>
      <button
        @click="addNote"
        style="margin-top:1.2em"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<style scoped>
  #entryModalContainer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    display: none;
    overflow: hidden;
    outline: 0;
    background: rgba(190, 188, 188, 0.8)
  }
  #entryModalContainer.fade {
    opacity: 0;
    transition: opacity .15s linear;
  }
  #entryModalContainer.fade.show {
    opacity: 1;
    display: block;
  }
  .modal-box {
    position: relative;
    max-width: 800px;
    margin: 1.75rem auto;
    background-color: white;
    border-radius: 5px;
    padding: 1.2em;
  }
  .modal-content-input {
    display: flex;
    /* display: ; */
  }
  .modal-content-input p {
    margin-top: 0;
    margin-bottom: 0;
    min-width: 10%;
    text-align: left;
  }
  .modal-content-input input, .modal-content-input textarea {
    min-width: 90%;
  }
</style>
