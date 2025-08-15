import { configureStore } from '@reduxjs/toolkit'
import { reducer } from './rootReducers'
import { middleware } from './middlewares'

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware()
        .concat(middleware)
    },
    devTools: true
})


export default store;


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


