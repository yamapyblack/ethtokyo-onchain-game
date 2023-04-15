// Import CSS styles, and necessary modules from packages
import styles from "../styles/NftMinter.module.css";
import { Contract } from "alchemy-sdk";
import { useState,useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";

// NFT Minter component
export default function Reveal({
  contractAddress,
  tokenUri,
  abi,
  contentSrc,
  contentType,
  salt,
  choice,
  goToStage,
}) {
  // Get the user's wallet address and status of their connection to it
  const { address, isDisconnected } = useAccount();
  // Get the signer instance for the connected wallet
  const { data: signer } = useSigner();
  // State hooks to track the transaction hash and whether or not the NFT is being minted
  const [txHash, setTxHash] = useState();
  const [isTx, setIsTx] = useState(false);
  const [result, setResult] = useState(-1);
  const [tmpStage, setTmpStage] = useState(0);

  const [isStartInterval, setIsStartInterval] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if(!isStartInterval) return;
      (async () => {
        await getStage();
      })();
    }, 1000); // Execute every 1000ms (1 second)

    // Clean up the interval when the component is unmounted or a dependency changes
    return () => {
      clearInterval(intervalId);
    };
  }, [isStartInterval]); // Empty dependency array, so the effect only runs on mount and unmount

  const getStage = async () => {
    console.log(tokenUri, contractAddress, address);
    // Create a new instance of the NFT contract using the contract address and ABI
    try {
      const battleContract = new Contract(contractAddress, abi, signer);
      const _stage = await battleContract.stage();
      console.log(_stage);

      if(_stage != 2){
        setTmpStage(_stage);
        const _result = await battleContract.getLastResult(address);
        console.log("_result", _result);
        setResult(_result);
      }
    } catch (e) {
      // If an error occurs, log it to the console and reset isEntering to false
      console.log(e);
    }
  }

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
      setIsStartInterval(true);
    } catch (e) {
      // If an error occurs, log it to the console and reset isTx to false
      console.log(e);
      setIsTx(false);
    }
  };

  const closePopupAndGoStage = async () => {
    goToStage(tmpStage);
  }

  return (
    <div>
      {result != 0 && (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '0.5rem',
          padding: '1rem',
          zIndex: 10,
          width: '40%',
          textAlign: 'center',
        }}
      >
        <h2>Result</h2>
        <p
          style={{
            fontSize: '2rem',
            padding: '1rem',
          }}>{result}</p>
        <button onClick={closePopupAndGoStage}
        style={{
          backgroundColor: '#4A5568',
          color: 'white',
          borderRadius: '0.25rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          border: 'none',
        }}>OK</button>
      </div>
      )}

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
            It's time to battle! You may need to wait a while once
            you click reveal now as your Pok3mon is hard in battle.
          </p>
          <hr className={styles.break} />
          <h3 className={styles.nft_instructions_title}>INSTRUCTIONS</h3>
          <p className={styles.text}>
            Click reveal now to see the outcome
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
    </div>
  );
}
