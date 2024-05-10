import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { Fragment, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/slides/userSlide';
import * as UserServices from './services/UserServices'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const {storageData, decoded} = handleDecoded()
    if (decoded?.id){
        handleGetDetailsUser(decoded?.id, storageData)
    }
  },)

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData){
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserServices.axiosJWT.interceptors.request.use(async (config) => {
    const {decoded} = handleDecoded()
    const currentTime = new Date()
    if (decoded?.exp < currentTime.getTime()/1000){
      const data = await UserServices.refreshToken()
      console.log(data)
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  const handleGetDetailsUser = async ( id, token) => {
    const res = await UserServices.getDetailUser(id, token)
    dispatch(updateUser({res}))
}
  
  // const fetchApi = async () => {
  //   const res = await axios.get('http://localhost:3001/api/product/getAllProduct')
  //   console.log(res)
  // }
  
  // const query = useQuery({ queryKey: ['todo'], queryFn: fetchApi})

  // useEffect(() => {
  //   fetchApi()
  // }, [])

  return (
    <div>
      <Router>
        <Routes>
          {routes.map(route => {
            const Page = route.page
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.page} path={route.path} element={
                <Layout >
                  <Page />
                </Layout>
              } />
            )
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
