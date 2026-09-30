
import './App.css'
import Login from './pages/Login'
import Landing from './pages/Landing'
import ChatArea from './components/ChatArea'
import Plans from './pages/Plans'
import Checkout from './pages/Checkout'
import { Routes,Route } from 'react-router-dom'


function App() {

  return (
    <>

    <Routes>
      <Route path='/' element={<Landing></Landing>}>
        <Route path='c/:chat_id' element={<ChatArea></ChatArea>}></Route>
        <Route path='plans' element={<Plans></Plans>}></Route>
        <Route path='checkout/:planId' element={<Checkout></Checkout>}></Route>

      
      </Route>
      <Route path='/login' element={<Login></Login>}></Route>
    </Routes>

     
    </>
  )
}

export default App
