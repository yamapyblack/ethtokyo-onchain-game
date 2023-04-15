// Import CSS styles, and necessary modules from packages
import styles from "../styles/NftMinter.module.css";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";

function getRandomString(length){
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

const encodeParameters = (types, values) => {
  const abi = new ethers.utils.AbiCoder();
  return ethers.utils.solidityKeccak256(types, values);
};

// NFT Minter component
export default function Reveal({
  contractAddress,
  tokenUri,
  abi,
  contentSrc,
  contentType,
  goNextStage,
  salt,
  choice,
}) {
  // Get the user's wallet address and status of their connection to it
  const { address, isDisconnected } = useAccount();
  // Get the signer instance for the connected wallet
  const { data: signer } = useSigner();
  // State hooks to track the transaction hash and whether or not the NFT is being minted
  const [txHash, setTxHash] = useState();
  const [isTx, setIsTx] = useState(false);

  // Function to mint a new NFT
  const reveal = async () => {
    console.log("choice:", choice);
    console.log(tokenUri, contractAddress, address);
    const battleContract = new Contract(contractAddress, abi, signer);

    try {
      setIsTx(true);
      // Call the smart contract function to mint a new NFT with the provided token URI and the user's address
      const tx = await battleContract.reveal(choice, salt);
      // Set the transaction hash in state to display in the UI
      setTxHash(tx?.hash);
      // Wait for the transaction to be processed
      await tx.wait();
      // Reset isTx and txHash in state
      setIsTx(false);
      setTxHash(null);
      goNextStage();
    } catch (e) {
      // If an error occurs, log it to the console and reset isTx to false
      console.log(e);
      setIsTx(false);
    }
  };
  return (
    <div className={styles.page_flexBox}>
      <div className={styles.page_container}>
        <div className={styles.nft_media_container}>
          {contentType == "video" ? (
            <video className={styles.nft_media} autoPlay={true}>
              <source src={contentSrc} type="video/mp4" />
            </video>
          ) : (
            <img src={contentSrc} className={styles.nft_media} />
          )}
        </div>

        <div className={styles.nft_info}>
          <h1 className={styles.nft_title}>BATTLE ROUND</h1>
          <p className={styles.text}>
            It's time to battle! Reveal your strategies and execute your moves.
          </p>
          <hr className={styles.break} />
          <h3 className={styles.nft_instructions_title}>INSTRUCTIONS</h3>
          <p className={styles.text}>
            This NFT is on MATIC Mumbai. You’ll need some test MATIC to mint the
            NFT. <a href="https://mumbaifaucet.com/">Get free test MATIC</a>
          </p>
          {isDisconnected ? (
            <p>Connect your wallet to get started</p>
          ) : !txHash ? (
            <button
              className={`${styles.button} ${
                isTx && `${styles.isTx}`
              }`}
              disabled={isTx}
              onClick={async () => await reveal()}
            >
              {isTx ? "Reveal" : "Reveal Now"}
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
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
