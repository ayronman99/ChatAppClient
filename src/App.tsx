import { Route, Routes } from 'react-router-dom'
import './App.css'
import ChatApp from './ChatAppdeprecated'
import FireChatApp from './ChatApp'
import Login from './Login'


function App() {
  return (
    <div className="App vh-100">
      <FireChatApp />
      {/* <Routes>
          <Route path="/" element={<ChatApp />} />
          <Route path="/login" element={<Login />} />
        </Routes> */}
    </div>
  )
}

export default App
