import { ref } from 'vue'

export const contentLoaded = ref( false )

// Goals store
export const goals = ref( [] )
export const weekStartDate = ref( new Date().toISOString() )
