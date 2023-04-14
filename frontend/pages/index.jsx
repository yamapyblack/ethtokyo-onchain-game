import styles from "../styles/Home.module.css";
import InstructionsComponent from "../components/InstructionsComponent";
import NftMinter from "../components/NftMinter";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <NftMinter></NftMinter>
      </main>
    </div>
  );
}
