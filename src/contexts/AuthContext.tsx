import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from "expo-auth-session"
import * as WebBrowse from "expo-web-browser";


WebBrowse.maybeCompleteAuthSession();

interface UserProps {
  name: string
  avatarUrl: string
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean
  signIn: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}


export const AuthContext = createContext({} as AuthContextDataProps)


export function AuthContextProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '659147439330-k28o0u31u2kel39bd53emcorckva1j8d.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
    scopes: ['profile', 'email']
  })

  console.log('AQUI O URI =>', AuthSession.makeRedirectUri({useProxy: true}))


  async function signIn() {
    try {
      setIsUserLoading(true)

      await promptAsync();
    } catch (error) {
      console.log(error)

      throw error
    }finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoogle(access_token: string) {
    console.log('TOKEN DE AUTENTICAÇÂO ==>', access_token)
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}