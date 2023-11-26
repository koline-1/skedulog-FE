import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import store from './redux/ConfigureStore.tsx';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { handleGraphQLError } from './handlers/GraphQLErrorHandlers.tsx';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const accessToken = store.getState().authToken.accessToken;
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
      'Access-Control-Allow-Origin': 'http://localhost:4000',
      'Access-Control-Allow-Credentials': true,
    }
  }
});

const errorLink = onError((err: any) => {
  if (err.graphQLErrors) {
    handleGraphQLError(err);
  }
})

const link = ApolloLink.from([errorLink, authLink.concat(httpLink)])

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    // query: {
    //   fetchPolicy: 'no-cache',
    // },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <CookiesProvider>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  </CookiesProvider>
)
