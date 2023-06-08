import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/react"
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

import theme from "../theme"

const client = new Client({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include"
  },
  exchanges: [cacheExchange, fetchExchange],
});



function MyApp({ Component, pageProps }): any {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>

        <CSSReset />
        <Component {...pageProps} />

      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
