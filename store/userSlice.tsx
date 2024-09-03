import { authenticateUser } from '@/request/ApiRest';
import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from './store';

interface UserState {
    user: any;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { logout, login, setError } = userSlice.actions;
export default userSlice.reducer;

export const authenticate = (email: string, pwd: string): AppThunk => async dispatch => {
    try {
        const response = await authenticateUser(email, pwd);
        if (response.error === 0) {
            dispatch(login(response));
        } else {
            dispatch(setError(response));
            throw new Error(response.error_m);
        }
    } catch (error) {
        dispatch(logout());
        throw error;
    }
}
