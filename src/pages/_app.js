import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  polygonMumbai,
  sepolia,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "../styles/custom-font.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "Graphik, sans-serif",
    heading: "Graphik, sans-serif",
  },
});

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, polygonMumbai, sepolia],
  [
    alchemyProvider({
      apiKey: "6gU6Ca6fUzx_4kzLzSWjqOsfZEuOx598",
      stallTimeout: 1_000,
    }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Test",
  projectId: "9b196aefe31db1835e5755559aa57107",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#7b3fe4",
          accentColorForeground: "white",
          borderRadius: "large",
          fontStack: "system",
          overlayBlur: "small",
        })}
        chains={chains}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
