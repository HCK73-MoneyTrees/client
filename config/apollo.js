import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink } from '@apollo/client';
import {setContext} from'@apollo/client/link/context'
import * as SecureStore from 'expo-secure-store'

const httpLink = createHttpLink({
  uri:'https://fpmt.patriapras.com'
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