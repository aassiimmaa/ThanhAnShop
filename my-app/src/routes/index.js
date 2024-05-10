import Home from '../pages/Home/Home'
import NotFountPage from '../pages/NotFoundPage/NotFoundPage'
import Order from '../pages/Order/Order'
import Products from '../pages/Products/Products'
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage'
import ProductDetail from '../pages/ProductDetailPage/ProductDetailPage'
import Profile from '../pages/Profile/ProfilePage'
import AdminPage from '../pages/AdminPage/AdminPage'

export const routes = [
    {
        path: '/',
        page: Home,
        isShowHeader: true
    },
    {
        path: '/order',
        page: Order
    },
    {
        path: '/products',
        page: Products
    },
    {   
        path: '/typeProducts',
        page: TypeProductPage,
        isShowHeader: true
    },
    {   
        path: '/productDetail',
        page: ProductDetail,
        isShowHeader: true
    },
    {
        path:'/profile',
        page: Profile,
        isShowHeader: true
    },
    {
        path:'/system/admin',
        page: AdminPage,
        isShowHeader: false
    },
    {
        path: '*',
        page: NotFountPage
    }
]