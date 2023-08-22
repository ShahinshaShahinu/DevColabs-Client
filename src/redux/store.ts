import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import userReducer from './user/userSlice'
import adminReduser from './admin/adminSlice'

const nonSerializableMiddleware = getDefaultMiddleware({
    serializableCheck: false,
  });

const persistConfig = {
    key: 'root',
    storage
   
}

const persistUserReducer = persistReducer(persistConfig, userReducer);
const persistAdminReducer = persistReducer(persistConfig, adminReduser);

export const Store = configureStore({

    reducer: {
        user: persistUserReducer,
        admin: persistAdminReducer
    },
    middleware:nonSerializableMiddleware
})

export const persistor = persistStore(Store)

