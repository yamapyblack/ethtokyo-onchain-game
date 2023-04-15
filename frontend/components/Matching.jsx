// Import CSS styles, and necessary modules from packages
import styles from "../styles/NftMinter.module.css";
import { Contract } from "alchemy-sdk";
import { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";

// NFT Minter component
export default function Matching({
  contractAddress,
  tokenUri,
  abi,
  contentSrc,
  contentType,
  goNextStage,
  tokenId
}) {
  // Get the user's wallet address and status of their connection to it
  const { address, isDisconnected } = useAccount();
  // Get the signer instance for the connected wallet
  const { data: signer } = useSigner();
  // State hooks to track the transaction hash and whether or not the NFT is being minted
  const [txHash, setTxHash] = useState();
  const [isEntering, setIsEntering] = useState(false);

  // Function to mint a new NFT
  const enter = async () => {
    console.log(tokenUri, contractAddress, address);
    // Create a new instance of the NFT contract using the contract address and ABI
    const battleContract = new Contract(contractAddress, abi, signer);
    try {
      // Set isEntering to true to show that the transaction is being processed
      setIsEntering(true);
      // Call the smart contract function to mint a new NFT with the provided token URI and the user's address
      const enterTx = await battleContract.enter(tokenId);
      // Set the transaction hash in state to display in the UI
      setTxHash(enterTx?.hash);
      // Wait for the transaction to be processed
      await enterTx.wait();
      // Reset isEntering and txHash in state
      setIsEntering(false);
      setTxHash(null);
      setIsStartInterval(true);
    } catch (e) {
      // If an error occurs, log it to the console and reset isEntering to false
      console.log(e);
      setIsEntering(false);
    }
  };

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
      if(_stage == 2){
        goNextStage();
      }
    } catch (e) {
      // If an error occurs, log it to the console and reset isEntering to false
      console.log(e);
    }
  }

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
          <h1 className={styles.nft_title}>Matching</h1>
          <p className={styles.text}>
          </p>
          {isDisconnected ? (
            <p>Connect your wallet to get started</p>
          ) : !txHash ? (
            <div>
            <button
              className={`${styles.button} ${
                isEntering && `${styles.isEntering}`
              }`}
              disabled={isEntering}
              onClick={async () => await enter()}
            >
              {isEntering ? "Etnering" : "Enter Now"}
            </button>
            </div>
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