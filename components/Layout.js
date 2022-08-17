import Header from './Header';
import styles from '/styles/Shared.module.css';

const Layout = ({ children }) => (
  <>
    <Header />
    <main className={styles.container}>{children}</main>
  </>
);

export default Layout;
