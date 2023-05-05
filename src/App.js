//libraries
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

//css
import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  const networks = [
    {
      name: "devnet",
      endpoint: "https://api.devnet.solana.com",
      chainId: "devnet",
    },
  ];
  const endpoint = clusterApiUrl("devnet");
  const walletAdapter = new PhantomWalletAdapter();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[walletAdapter]} autoConnect networks={networks}>
        <WalletModalProvider>
          <WalletMultiButton />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
