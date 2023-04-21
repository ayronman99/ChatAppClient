import React from 'react'
import { createContext } from 'react';


export const UserCntxtPrvdr = createContext<User | null>(null);

export default function UserContext({ children }: UserContextProp) {
    
    const [currUser, setCurrUser] = React.useState("");

    return (
        <UserCntxtPrvdr.Provider value={{user: currUser, setUser: setCurrUser}}>
            {children}
        </UserCntxtPrvdr.Provider>
    )
}
