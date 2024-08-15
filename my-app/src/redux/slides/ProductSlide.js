import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   search: ''
}

export const ProductSlide = createSlice({
    name: 'product',
    initialState,
    reducers: {
        searchProduct: (state, action) => {
            state.search = action.payload
        }
    }
})

export const {searchProduct} = ProductSlide.actions

export default ProductSlide.reducer