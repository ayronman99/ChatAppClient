import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider, UserInfo } from "firebase/auth"
import firebaseConfig from "../credentials/fireBaseInitConf"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { getFirestore, query, orderBy, limit, collection, FirestoreDataConverter, DocumentData, SnapshotOptions, QueryDocumentSnapshot, DocumentReference, WithFieldValue } from "firebase/firestore"
import { FormEvent, useState } from "react"
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";


interface Messages extends DocumentData {
    id?: string
    createdAt?: Date
    message?: string
    photoURL?: string | null
};


const initFire = initializeApp(firebaseConfig);
const auth = getAuth(initFire);
const firestore = getFirestore(initFire);


function signIn() {
    const signInGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }
    return signInGoogle;
}

// function signOut() {
//     return auth.currentUser
// }

export default function FireChatApp() {
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
        <div>
            <h1>Sign In</h1>
            <button onClick={signIn}> Sign in using Google</button>
        </div>
    )
}
function ChatTime() {

    const msgsConverter: FirestoreDataConverter<Messages> = {
        toFirestore(messages: WithFieldValue<Messages>): DocumentData {
            return { user: messages.id, title: messages.message };
        },
        fromFirestore(
            snapshot: QueryDocumentSnapshot,
            options: SnapshotOptions
        ): Messages {
            const data = snapshot.data(options);
            return {
                id: snapshot.id,
                createdAt: data.createdAt,
                message: data.message,
                photoURL: data.photoURL

            };
        },
    };
    const msgsRef = collection(firestore, 'messages')
    const queryMsg = query(msgsRef, orderBy("createdAt"), limit(50));
    const [messages] = useCollectionData(queryMsg);


    const [formValue, setFormValue] = useState('');


    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(1)
        const { uid, photoURL } = auth.currentUser as UserInfo;
        console.log(2)

        await addDoc(msgsRef, {
            id: uid,
            createdAt: serverTimestamp(),
            message: formValue,
            photoURL
        })
        console.log(3)

        setFormValue('');

    }
    return (
        <>
            <header>
                <button onClick={() => { auth.signOut }}>Logout</button>
            </header>
            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.id} messagesData={msg} />)}
            </main>

            <form onSubmit={sendMessage}>

                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something nice" />

                <button type="submit" disabled={!formValue}>🚀</button>

            </form>
        </>
    )
}

function ChatMessage(props: { messagesData: Messages }) {
    const { message, id, photoURL } = props.messagesData;

    const messageClass = id === auth?.currentUser?.uid ? 'sent' : 'received';
    const imgSrc = photoURL ? photoURL : '';

    return (<>
        <div className={`message ${messageClass}`}>
            <img src={imgSrc} />
            <p>{message}</p>
        </div>
    </>)
}