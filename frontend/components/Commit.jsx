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
export default function Commit({
  contractAddress,
  tokenUri,
  abi,
  contentSrc,
  contentType,
  goNextStage,
}) {
  // Get the user's wallet address and status of their connection to it
  const { address, isDisconnected } = useAccount();
  // Get the signer instance for the connected wallet
  const { data: signer } = useSigner();
  // State hooks to track the transaction hash and whether or not the NFT is being minted
  const [txHash, setTxHash] = useState();
  const [isCommiting, setIsCommiting] = useState(false);

  const [salt, setSalt] = useState();

  // Function to mint a new NFT
  const commit = async (choice) => {
    console.log("choice:", choice);
    console.log(tokenUri, contractAddress, address);
    const battleContract = new Contract(contractAddress, abi, signer);

    //create random salt and store it
    const rand = getRandomString(31);
    console.log("rand:", rand);
    const _salt = ethers.utils.formatBytes32String(rand);
    setSalt(_salt);

    //sign the commitment
    const commitment = encodeParameters(
      ["address", "uint8", "bytes32"],
      [address, choice, _salt]
    );

    try {
      setIsCommiting(true);
      // Call the smart contract function to mint a new NFT with the provided token URI and the user's address
      const commitTx = await battleContract.commit(commitment);
      // Set the transaction hash in state to display in the UI
      setTxHash(commitTx?.hash);
      // Wait for the transaction to be processed
      await commitTx.wait();
      // Reset isCommiting and txHash in state
      setIsCommiting(false);
      setTxHash(null);
      goNextStage();
    } catch (e) {
      // If an error occurs, log it to the console and reset isCommiting to false
      console.log(e);
      setIsCommiting(false);
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
          <h1 className={styles.nft_title}>Create Web3 Dapp NFT</h1>
          <h3 className={styles.nft_author}>By Alchemy.eth</h3>
          <p className={styles.text}>
            Bootstrap a full stack dapp in 5 minutes with customizable
            components and project templates using Create Web3 Dapp.
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
                isCommiting && `${styles.isCommiting}`
              }`}
              disabled={isCommiting}
              //TODO
              onClick={async () => await commit(1)}
            >
              {isCommiting ? "Commiting" : "Commit Now"}
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
