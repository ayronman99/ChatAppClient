import { useContext, useState } from 'react'
import { UserCntxtPrvdr } from './contexts/UserContext'

export default function Login() {

    const { setUser } = useContext(UserCntxtPrvdr) as User;
    const [userSetter, setUserSetter] = useState("");

    function setUserContext() {
        setUser(userSetter);
    }

    
    return (
        <div className='container-md vh-100 d-flex justify-content-center align-items-center'>
            <form>
                <label>Enter your username</label>
                <div className="input-group flex-nowrap">
                    <span className="input-group-text" id="addon-wrapping"><i className="fa-solid fa-user"></i></span>
                    <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping"
                        value={userSetter}
                        onChange={(e) => setUserSetter(e.target.value)}
                    />
                </div>
                <button type="button" className={`btn mt-2 ${userSetter.length >= 3 ? "btn-success" : ""}`}disabled={userSetter.length < 3} onClick={setUserContext}>Enter Chat</button>
            </form>
        </div>
    )
}
