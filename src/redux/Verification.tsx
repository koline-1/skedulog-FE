import { createSlice } from '@reduxjs/toolkit';
import { VerificationStateInterface } from '../interfaces/state/VerificationStateInterface';

/**
 * 2차인증 여부 관리 slice
 */
export const verificationSlice = createSlice({
    name: 'verification',
    initialState: {
        isVerified: false
    },
    reducers: {
        SET_VERIFIED: (state: VerificationStateInterface) => {
            state.isVerified = true;
        },
        UNSET_VERIFIED: (state: VerificationStateInterface) => {
            state.isVerified = false;
        },
    }
})

export const { SET_VERIFIED, UNSET_VERIFIED } = verificationSlice.actions;

export default verificationSlice.reducer;