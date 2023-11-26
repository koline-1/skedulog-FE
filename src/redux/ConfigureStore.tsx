import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './Auth';
import verificationReducer from './Verification';

/**
 * redux reducers 관리 store
 */
export default configureStore({
    reducer: {
        authToken: tokenReducer,
        verification: verificationReducer
    },
});
