<template>
  <div class="sm:p-6 p-2 bg-white rounded-2xl flex flex-col w-full gap-6">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-xl text-color text-left">Мои карты</h3>
      <button @click="modal = true" class="text-white font-semibold p-3 rounded-3xl sm:w-40 w-36 bg-orange-600 active:opacity-80 hover:opacity-80">
        Добавить карту
      </button>
    </div>

    <div style="height: 420px;" class="flex flex-wrap scroll-style gap-5 overflow-y-scroll">
      <div v-for="item in cards">
        <div class="card-width border border-gray-200 px-3 py-4 rounded-lg flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div v-if="item.type === 'Uzcard'" class="w-12 h-12 credit-card">
              <the-icon src="uzcard" />
            </div>
            <div v-else>
              <the-icon src="humo" />
            </div>
            <h3 class="text-gray-700 text-base">{{ item.card_number }}</h3>
          </div>
          <the-icon class="cursor-pointer" src="trash-gray" />
        </div>
      </div>
    </div>


    <div v-if="modal" class="modal">
      <input
        class="bg-white text-gray-500 border rounded-2xl border-gray-200
         py-2.5 px-4 text-base h-12 outline-orange-600 w-full bg-gray-100 my-6"
        v-model.number="number"
        placeholder="Введите номер телефона"
        type="number"
      >
      <button
        @click="addCard"
        class="w-full h-12 rounded-3xl bg-orange-600 text-white font-semibold"
      >
        Добавить карту
      </button>
    </div>
    <div @click="modal = false" v-if="modal" class="modal-background"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [],
      modal: false,
      number: ''
    }
  },
  mounted() {
    this.getCards()
  },
  methods: {
    getCards() {
      this.$axios.get('cards').then(res => {
        const { objects } = res
        this.cards = objects
      })
    },
    addCard()  {
       this.$axios.put(`cards`, {
          params: {}
       })
    }
  }
}
</script>

<style scoped>
.card-width {
  width: 400px;
}
.credit-card {
  border: 1.5px solid #F3F4F6;
  box-shadow: -3px -2px 20px -10px rgba(0, 0, 0, 0.19), 0px 4px 7px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
}

.scroll-style::-webkit-scrollbar {
  height: 0;
  width: 3px;
  border-radius: 24px;
}
.scroll-style::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.scroll-style::-webkit-scrollbar-thumb {
  background: #bcbcbc;
}
.scroll-style::-webkit-scrollbar-thumb:hover {
  background: #a4a4a4;
}
.modal-background {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background: #111827;
  opacity: 0.3;
}
.modal {
  position: absolute;
  width: 320px;
  left: 50%;
  top: 50%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  z-index: 5;
  transform: translate(-50%, -50%);
  border-radius: 16px;
}

@media screen and (max-width: 500px) {
  .card-width {
    width: 310px;
  }
}
</style>
