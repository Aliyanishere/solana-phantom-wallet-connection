//libraries
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

const AccountInfo = () => {
  const [balance, setBalance] = useState(null);
  const [tokenAccounts, setTokenAccounts] = useState([]);
  const { publicKey } = useWallet();

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
                  {account.account.tokenAmount.amount}{" "}
                  {account.account.tokenAmount.uiAmountString}{" "}
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
