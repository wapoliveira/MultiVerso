export const useUserStore = defineStore('userStore', {
    state: () => {
      return {
        name: null,
        userData: null,
      }
    },
    persist: {
      storage: persistedState.localStorage
    }
  })
  