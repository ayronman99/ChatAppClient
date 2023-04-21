import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider, UserInfo } from "firebase/auth"
import firebaseConfig from "../credentials/fireBaseInitConf"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { getFirestore, query, orderBy, limit, collection, DocumentData } from "firebase/firestore"
import { FormEvent, useEffect, useRef, useState } from "react"
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./chatApp.css";


interface Messages extends DocumentData {
    message?: string
    createdAt?: Date
    photoURL?: string | null
};


const initFire = initializeApp(firebaseConfig);
const auth = getAuth(initFire);
const firestore = getFirestore(initFire);


const signInGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}

function FireChatApp() {
    const [user] = useAuthState(auth);

    return (
        <div>
            <section>
                {user ? <ChatTime /> : <SignInPage />}
            </section>
        </div>
    )
}


function SignInPage() {
    return (
        <div className="vh-100 container-lg d-flex flex-column justify-content-center align-items-center text-bg-secondary">
            <h1>Sign In to start chattin</h1>
            <button className="btn btn-success" onClick={signInGoogle}> Sign in using Google </button>
        </div>
    )
}

function SignOutPage() {
    return auth.currentUser && (<button className="btn btn-danger" onClick={() => { auth.signOut() }}>Logout</button>)

}
function ChatTime() {

    const trackChat = useRef<null | HTMLElement>(null);
    const msgsRef = collection(firestore, 'messages')
    const queryMsg = query(msgsRef, orderBy("createdAt"), limit(50));
    const [messages] = useCollectionData(queryMsg);

    useEffect(() => {
        trackChat?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])
    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { uid, photoURL } = auth.currentUser as UserInfo;

        await addDoc(msgsRef, {
            message: formValue,
            createdAt: serverTimestamp(),
            photoURL,
            uid
        })

        setFormValue('');

    }
    return (
        <div className="">
            <header>
                <nav className="navbar navbar-expand-lg bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">ChatAp<sub>&copy;Lee</sub></a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/">Home</a>
                                </li>

                            </ul>
                            <form className="d-flex" role="logout">
                                <SignOutPage />
                            </form>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="h-100 p-1">
                <div className="">
                    {messages === undefined || messages.length < 1 
                    ?
                     (<div className="text-center"><h2>No activity yet, initiate the chat!</h2></div>) 
                     : 
                     messages?.map((msg: DocumentData) => <ChatMessage key={msg.id} messagesData={msg} />)}
                </div>
                <form className="w-100 position-absolute bottom-0 start-0 d-flex align-items-center" onSubmit={sendMessage}>
                    <div className="input-group input-group-sm">
                        <input className="w-75 form-control" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say Hello!" />
                    </div>

                    <button className={`btn btn-sm ${!formValue ? "btn-secondary opacity-25" : "btn-success"} w-25 h-100 `} type="button" disabled={!formValue}>🚀</button>
                </form>
            </main>


        </div>
    )
}

function ChatMessage(props: { messagesData: Messages }) {
    const { message, uid, photoURL } = props.messagesData;

    const messageClass = uid === auth?.currentUser?.uid ? 'sent' : 'received';
    const imgSrc = photoURL ? photoURL : '';

    return (<>
        <div className={`message ${messageClass}`}>
            <img src={imgSrc} />
            <p>{message}</p>
        </div>
    </>)
}


export default FireChatApp;