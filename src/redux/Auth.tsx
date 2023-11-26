import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthTokenStateInterface } from '../interfaces/state/AuthTokenStateInterface';

/**
 * accessToken 관리 slice
 */
export const tokenSlice = createSlice({
    name: 'authToken',
    initialState: {
        authenticated: false,
        accessToken: null,
        expirationTime: null
    },
    reducers: {
        SET_TOKEN: (state: AuthTokenStateInterface, action: PayloadAction<AuthTokenStateInterface>) => {
            state.accessToken = action.payload.accessToken;
            state.expirationTime = action.payload.expirationTime;
        },
        DELETE_TOKEN: (state: AuthTokenStateInterface) => {
            state.accessToken = null;
            state.expirationTime = null
        },
    }
})

export const { SET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;