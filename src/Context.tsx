
import React, { createContext, useContext, useState } from "react";
import { unknown } from "zod"

const context = createContext({
  id: window.crypto.randomUUID() as string,
  setId: unknown as React.Dispatch<React.SetStateAction<string>>
})

export function ContextProvider({children}:{children: React.ReactNode}) {
    const [id, setId] = useState<string>(() => window.crypto.randomUUID())
    return <context.Provider value={{id, setId}}>
        {children}
    </context.Provider>
}

export const useGlobalId = () => useContext(context)