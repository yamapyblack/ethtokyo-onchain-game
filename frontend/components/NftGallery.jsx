// Importing necessary modules and components
import styles from "../styles/NftGallery.module.css";
import { Contract } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

// Defining the main component of the NFT gallery
export default function NftGallery({
	nftContractAddress,
  abi,
  goNextStage,
}) {
  const { address, isDisconnected } = useAccount();
  const { data: signer } = useSigner();
  const [txHash, setTxHash] = useState();
  const [isTx, setIsTx] = useState(false);

	const nfts = [
		"https://public.bnbstatic.com/static/academy/uploads-original/68e621fd4a4e4e77a9de84cf9f6b2dd3.png",
		"https://public.bnbstatic.com/static/academy/uploads-original/68e621fd4a4e4e77a9de84cf9f6b2dd3.png",
		"https://public.bnbstatic.com/static/academy/uploads-original/68e621fd4a4e4e77a9de84cf9f6b2dd3.png",
		"https://public.bnbstatic.com/static/academy/uploads-original/68e621fd4a4e4e77a9de84cf9f6b2dd3.png",
		"https://public.bnbstatic.com/static/academy/uploads-original/68e621fd4a4e4e77a9de84cf9f6b2dd3.png",
		"https://public.bnbstatic.com/static/academy/uploads-original/68e621fd4a4e4e77a9de84cf9f6b2dd3.png",
	]

	// Function to mint a new NFT
	const mint = async () => {
		console.log(nftContractAddress, address);
		const nftContract = new Contract(nftContractAddress, abi, signer);
		try {
			setIsTx(true);
			const tx = await nftContract.mint();
			setTxHash(tx?.hash);
			await tx.wait();
			setIsTx(false);
			setTxHash(null);
			goNextStage();
		} catch (e) {
			console.log(e);
			setIsTx(false);
		}
	};
	
	// Once data is loaded, display NFT gallery
	return (
		<div className={styles.nft_gallery_page_container}>
			{isDisconnected ? (
				<p>Connect your wallet to get started</p>
			) : !txHash ? (
			<div className={styles.nft_gallery}>
				<div className={styles.nfts_display}>
					{nfts?.length ? (
						nfts.map((nft) => {
							return <NftCard nft={nft} mint={mint} />;
						})
					) : (
						<p>No NFTs found for the selected address</p>
					)}
				</div>
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
	);
}

function NftCard({ nft,mint }) {
	return (
		<div className={styles.card_container}>
			<div className={styles.image_container}	
				onClick={async () => await mint()}>
				<img src={nft}>
				</img>
			</div>
			{/* {/* <div className={styles.info_container}>
				<div className={styles.title_container}>
					<h3>
						{nft.title ? nft.tile?.length > 20
							? `${nft.title.substring(0, 12)}...`
							: nft.title : `${nft.symbol} ${nft.tokenId.substring(0,4)}`}
					</h3>
				</div>
				<hr className={styles.separator} />
				<div className={styles.symbol_contract_container}>
					<div className={styles.symbol_container}>
						<p>
							{nft.collectionName &&
							nft.collectionName.length > 20
								? `${nft.collectionName.substring(0, 20)}`
								: nft.collectionName}
						</p>

						{nft.verified == "verified" ? (
							<img
								src={
									"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
								}
								width="20px"
								height="20px"
							/>
						) : null}
					</div>
					<div className={styles.contract_container}>
						<p className={styles.contract_container}>
							{nft.contract?.slice(0, 6)}...
							{nft.contract?.slice(38)}
						</p>
						<img
							src={
								"https://etherscan.io/images/brandassets/etherscan-logo-circle.svg"
							}
							width="15px"
							height="15px"
						/>
					</div>
				</div>

				<div className={styles.description_container}>
					<p>{nft.description}</p>
				</div> }
			</div> */}
		</div>
	);
}