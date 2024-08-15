import axios from "axios"

export const getAllProduct = async (search, limit) => {
    let res = {}
    if (search && search.length > 0){
        res = await axios.get(`http://localhost:3001/api/product/getAllProduct?filter=name&filter=${search}&limit=${limit}`)
    }else if (limit && limit > 0){
        res = await axios.get(`http://localhost:3001/api/product/getAllProduct?limit=${limit}`)
    }else{
        res = await axios.get(`http://localhost:3001/api/product/getAllProduct`)
    }
    return res.data
}

export const getAllType = async () => {
    const res = await axios.get('http://localhost:3001/api/product/getAllType')
    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post('http://localhost:3001/api/product/create', data)
    return res.data
}

export const getDetailProduct = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/product/details/${id}`)
    return res.data
}

export const updateProduct = async (id, data) => {
    const res = await axios.put(`http://localhost:3001/api/product/update/${id}`, data)
    return res.data
}

export const deleteProduct = async (id) => {
    const res = await axios.delete(`http://localhost:3001/api/product/delete/${id}`)
    return res.data
}

export const deleteManyProduct = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/product/deleteMany`, data)
    return res.data
}