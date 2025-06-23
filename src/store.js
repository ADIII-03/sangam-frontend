import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../src/store/slice/user/user.slice.js';
import ngoReducer from '../src/store/slice/ngo/ngo.slice.js';
import ngoPostReducer from '../src/store/slice/ngopost/ngopost.slice.js';
import userPostReducer from '../src/store/slice/userpost/userpost.slice.js';
import { messageSlice } from './store/slice/message/message.slice.js';
import  notificationSlice  from './store/slice/notification/notification.slice.js';
export const store = configureStore({
    reducer : {
        
      user : userReducer,
      ngo : ngoReducer,
      ngopost: ngoPostReducer,
      userpost: userPostReducer,
      message :  messageSlice.reducer,
      notification : notificationSlice
  

    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck :{
      ignoredPaths: ['socket.socket'],
    }
    })

})

