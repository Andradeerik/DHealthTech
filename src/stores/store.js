import { defineStore } from 'pinia';

export const useStore = defineStore('counter', {
  state: () => ({
    UserUID: ''
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      // this.counter++;
    },
  },
});
