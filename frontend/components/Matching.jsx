// Import CSS styles, and necessary modules from packages
import styles from "../styles/NftEnterer.module.css";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";

// NFT Enterer component
export default function Matching({
  contractAddress,
  tokenUri,
  abi,
  contentSrc,
}) {
  // Get the user's wallet address and status of their connection to it
  const { address, isDisconnected } = useAccount();
  // Get the signer instance for the connected wallet
  const { data: signer } = useSigner();
  // State hooks to track the transaction hash and whether or not the NFT is being Entered
  const [txHash, setTxHash] = useState();
  const [isEntering, setIsEntering] = useState(false);

  // Function to Enter a new NFT
  const enter = async () => {
    console.log(tokenUri, contractAddress, address);
    // Create a new instance of the NFT contract using the contract address and ABI
    const battleContract = new Contract(contractAddress, abi, signer);
    try {
      // Set isEntering to true to show that the transaction is being processed
      setIsEntering(true);
      // Call the smart contract function to Enter a new NFT with the provided token URI and the user's address
      const enterTx = await battleContract.enter(address, tokenUri);
      // Set the transaction hash in state to display in the UI
      setTxHash(enterTx?.hash);
      // Wait for the transaction to be processed
      await enterTx.wait();
      // Reset isEntering and txHash in state
      setIsEntering(false);
      setTxHash(null);
    } catch (e) {
      // If an error occurs, log it to the console and reset isEntering to false
      console.log(e);
      setIsEntering(false);
    }
  };
  return (
    <div className={styles.page_flexBox}>
      <div className={styles.page_container}>
        <div className={styles.nft_media_container}>
          <img src={contentSrc} className={styles.nft_media} />
        </div>

        <div className={styles.nft_info}>
          <h1 className={styles.nft_title}>Create Web3 Dapp NFT</h1>
          <h3 className={styles.nft_author}>By Alchemy.eth</h3>
          <p className={styles.text}>
            Bootstrap a full stack dapp in 5 minutes with customizable
            components and project templates using Create Web3 Dapp.
          </p>
          <hr className={styles.break} />
          <h3 className={styles.nft_instructions_title}>INSTRUCTIONS</h3>
          <p className={styles.text}>
            This NFT is on MATIC Mumbai. You’ll need some test MATIC to Enter the
            NFT. Get free test MATIC
          </p>
          {isDisconnected ? (
            <p>Connect your wallet to get started</p>
          ) : !txHash ? (
            <button
              className={`${styles.button} ${
                isEntering && `${styles.isEntering}`
              }`}
              disabled={isEntering}
              onClick={async () => await enter()}
            >
              {isEntering ? "Entering" : "Enter Now"}
            </button>
          ) : (
            <div>
              <h3 className={styles.attribute_input_label}>TX ADDRESS</h3>
              <a
                href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className={styles.address_container}>
                  <div>
                    {txHash.slice(0, 6)}...{txHash.slice(6, 10)}
                  </div>
                  <img
                    src={
                      "https://static.alchemyapi.io/images/cw3d/Icon%20Large/etherscan-l.svg"
                    }
                    width="20px"
                    height="20px"
                  />
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}