import { defineStore } from "pinia";
import { ref } from "vue";

export const useCardStore = defineStore('cards', () => {
  const cards = ref<{front: string; back: string}[]>([])

  function addCard(front: string, back: string) {
    cards.value.push({front, back})

  }

    function clearCards() {
      cards.value = []
    }


  return {cards, addCard, clearCards}
})
