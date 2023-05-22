//libraries
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  createMint,
  getAccount,
  getMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { clusterApiUrl, Keypair } from "@solana/web3.js";
import { Buffer } from "buffer";
global.Buffer = Buffer;

const AccountInfo = () => {
  const [balance, setBalance] = useState(null);
  const [tokenAccounts, setTokenAccounts] = useState([]);
  const { publicKey } = useWallet();
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const mint = createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9 // We are using 9 to match the CLI decimal default exactly
  );

  mint.then((res) => console.log(res)).catch((err) => console.log(err));

  console.log("mint", mint);

  const mintInfo = getMint(connection, mint);

  console.log("mintInfo", mintInfo.supply);

  const tokenAccount = getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log("tokenAccount.address", tokenAccount.address);

  const tokenAccountInfo = getAccount(connection, tokenAccount.address);

  console.log("amount", tokenAccountInfo.amount);
  // 0

  useEffect(() => {
    if (!publicKey) return;

    const connection = new Connection("https://api.devnet.solana.com");

    // Retrieving the account balance here
    connection
      .getBalance(publicKey)
      .then((balance) => setBalance(balance / 10 ** 9));

    // Retrieving the token accounts here
    connection
      .getTokenAccountsByOwner(new PublicKey(publicKey.toBase58()))
      .then((accounts) => setTokenAccounts(accounts.value));
  }, [publicKey]);

  return (
    <div
      style={{
        color: "white",
      }}
    >
      {!publicKey ? (
        <p>Connect to the wallet to display details</p>
      ) : (
        <>
          <h2>Account Details:</h2>
          <p>Public Key: {publicKey?.toBase58()}</p>
          <p>Balance: {balance} SOL</p>
          <p>Tokens:</p>
          {tokenAccounts.length === 0 ? (
            <p>No tokens available</p>
          ) : (
            <ul>
              {tokenAccounts.map((account) => (
                <li key={account.pubkey.toBase58()}>
                  {account.account.tokenAmount.amount}
                  {account.account.tokenAmount.uiAmountString}
                  {account.account.mint.symbol}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AccountInfo;
