import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: '',
    name: '',
    image: '',
    type: '',
    price: 0,
    description: '',
    countInStock: 0,
    rating: 0,
    discount: 0,
    sold: 0,
    listImage: []
}

export const ProductSlide = createSlice({
    name: 'product',
    initialState,
    reducers: {
        updateProduct: (state, action) => {
            if (action.payload.res){
                const { 
                    _id =  '',
                    name =  '',
                    image =  '',
                    type =  '',
                    price =  0,
                    description =  '',
                    countInStock =  0,
                    rating =  0,
                    discount =  0,
                    sold =  0
                } = action.payload.res.data
                state.id = _id
                state.name = name
                state.image = image
                state.type = type
                state.price = price
                state.description = description
                state.countInStock = countInStock
                state.rating = rating
                state.discount = discount
                state.sold = sold
            } else{
                const { 
                    _id =  '',
                    name =  '',
                    image =  '',
                    type =  '',
                    price =  0,
                    description =  '',
                    countInStock =  0,
                    rating =  0,
                    discount =  0,
                    sold =  0
                } = action.payload.res.data
                state.id = _id
                state.name = name
                state.image = image
                state.type = type
                state.price = price
                state.description = description
                state.countInStock = countInStock
                state.rating = rating
                state.discount = discount
                state.sold = sold
            }
        },
        resetProduct: (state) => {
            const { _id, name, image, type, price, description, countInStock, rating, discount, sold } = action.payload.res.data
            state.id = _id
            state.name = name
            state.image = image
            state.type = type
            state.price = price
            state.description = description
            state.countInStock = countInStock
            state.rating = rating
            state.discount = discount
            state.sold = sold
        }
    }
})

export const {updateProduct, resetProduct} = ProductSlide.actions

export default ProductSlide.reducer