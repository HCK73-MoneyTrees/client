import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink } from '@apollo/client';
import {setContext} from'@apollo/client/link/context'
import * as SecureStore from 'expo-secure-store'

const httpLink = createHttpLink({
  // uri: 'http://3.26.67.84', //ip aws dari sini bisa register
  // uri: 'https://line.patriapras.com', //ip cloudflare dari sini ga bisa
  uri:'http://localhost:4000'
})

const authLink = setContext(async (_,{headers})=>{
  const token = await SecureStore.getItemAsync('access_token')
  console.log(token,"sa");
  
  return{
    headers:{
      ...headers,
      authorization: token? `Bearer ${token}`:''
    }
  }
})

const client = new ApolloClient({
    link:authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  export default client