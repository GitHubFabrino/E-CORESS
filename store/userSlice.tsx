import { authenticateUser } from '@/request/ApiRest';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk } from './store';

interface UserState {
    user: any;
    idUser: any;
    isAuthenticated: boolean;
    error: string | null;
    spotlight: any;
    allChats: any,
    newM: any,
    lang: any,
    isEmail: boolean,
    isPhone: boolean,
    isFb: boolean
}

const initialState: UserState = {
    user: null,
    idUser: null,
    isAuthenticated: false,
    error: null,
    spotlight: null,
    allChats: null,
    newM: null,
    lang: null,
    isEmail: false,
    isPhone: false,
    isFb: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.idUser = action.payload.user.id || null
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSpotlight: (state, action) => {
            state.spotlight = action.payload
        },
        setAllChats: (state, action) => {
            state.allChats = action.payload
        },
        setNewmessage: (state, action) => {
            state.newM = action.payload
        },
        setLanguage: (state, action) => {
            state.lang = action.payload
        },
        setActiveMethod: (state, action: PayloadAction<string>) => {
            state.isEmail = action.payload === 'email';
            state.isFb = action.payload === 'fb';
            state.isPhone = action.payload === 'phone';
        }
    },
});

export const { logout, login, setError, setSpotlight, setAllChats, setNewmessage, setLanguage, setActiveMethod } = userSlice.actions;
export default userSlice.reducer;

export const authenticate = (email: string, pwd: string): AppThunk => async dispatch => {
    try {
        const response = await authenticateUser(email, pwd);
        if (response.error === 0) {
            dispatch(login(response));
            console.log('reponse login ', response);

            return response
        } else {
            dispatch(setError(response));
            // throw new Error(response.error_m);
            return response
        }
    } catch (error) {
        dispatch(logout());
        throw error;
    }
}
