import Navbar from "../components/navigation/navbar";
// import styles from "../styles/mainlayout.css";

export default function MainLayout({ children }) {
	return (
		<div>
            <Navbar />
            {children}
		</div>
	);
}
