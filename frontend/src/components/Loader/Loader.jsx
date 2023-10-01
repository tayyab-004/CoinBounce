import { RotatingLines } from "react-loader-spinner";
import styles from "./Loader.module.css";

function Loader({ text }) {
  return (
    <div className={styles.loaderWrapper}>
      <h2>Loading {text}</h2>
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
}

export default Loader;
