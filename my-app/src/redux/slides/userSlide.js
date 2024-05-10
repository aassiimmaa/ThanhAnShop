import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: '',
    name: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: '',
    isAdmin: false
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            if (action.payload.res){
                const { access_token = ""} = action.payload.res
                const { name = "user", email = "", phone = "", address = "", avatar = "", _id = "", password = "", isAdmin = false} = action.payload.res.data
                state.id = _id
                state.name = name
                state.password = password
                state.email = email
                state.phone = phone
                state.address = address
                state.avatar = avatar
                state.access_token = access_token
                state.isAdmin = isAdmin
            } else{
                const { access_token = "" } = action.payload
                const { name = "user", email = "", phone = "", address = "", avatar = "", _id = "", password = "", isAdmin = false} = action.payload.data
                state.id = _id
                state.name = name
                state.password = password
                state.email = email
                state.phone = phone
                state.address = address
                state.avatar = avatar
                state.access_token = access_token
                state.isAdmin = isAdmin
            }
        },
        resetUser: (state) => {
            const { name, email, phone, address, avatar, access_token, _id, password, isAdmin} = initialState
            state.id = _id
            state.name = name
            state.password = password
            state.email = email
            state.phone = phone
            state.address = address
            state.avatar = avatar
            state.access_token = access_token
            state.isAdmin = isAdmin
        }
    }
})

export const {updateUser, resetUser} = userSlide.actions

export default userSlide.reducer