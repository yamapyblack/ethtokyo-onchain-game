// Importing necessary modules and components
import styles from "../styles/NftGallery.module.css";
import { Contract } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

const dummyNft1 = "0x0000000000000000000000000000000000000001";
const dummyNft2 = "0x0000000000000000000000000000000000000002";

// Defining the main component of the NFT gallery
export default function NftGallery({
	nftCreatorAddress,
	nftReaderAddress,
	createAbi,
	readerAbi,
  goNextStage,
	setTokenId,
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
	const mint = async (nftTokenId) => {
		console.log(address);
		const nftCreatorContract = new Contract(nftCreatorAddress, createAbi, signer);
		const nftReaderContract = new Contract(nftReaderAddress, readerAbi, signer);
		const payload = await nftReaderContract.mockPayload(address, dummyNft1, nftTokenId);
		console.log(payload);

		try {
			setIsTx(true);
			const tx = await nftCreatorContract.mockNonblockingLzReceive(10109, '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8', 0, payload);
			setTxHash(tx?.hash);
			await tx.wait();

			//setTokenId
			const mintedTokenId = (await nftCreatorContract.currentTokenId()) - 1;
			setTokenId(mintedTokenId);

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
						nfts.map((nft,i) => {
							return <NftCard nft={nft} mint={mint} index={i} />;
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

function NftCard({ nft,mint,index,setTokenId }) {
	return (
		<div className={styles.card_container}>
			<div className={styles.image_container}	
				onClick={async () => await mint(index)}>
				<img src={nft}>
				</img>
			</div>
		</div>
	);
}