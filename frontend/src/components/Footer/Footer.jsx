import styles from "./Footer.module.css";
function Footer() {
  return <p className={styles.footer}>&copy; CoinBounce 2020-{new Date().getFullYear()}</p>;
}

export default Footer;
