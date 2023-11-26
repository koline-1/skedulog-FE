import { Layout, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import logo from "../../images/skedulog_no_bg_underline.png";

const { Footer: FooterComponent } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {


    return (
        <div className={styles.footer_container}>
            <FooterComponent className={styles.footer}>
                <Space className={styles.footer_space}>
                    <img src={logo} />
                    <Text>©2023 Created by Koline-1</Text>
                    <div></div>
                    <Link to="/">to be added</Link>
                    <p className={styles.footer_space_divider}>|</p>
                    <Link to="/">to be added</Link>
                    <p className={styles.footer_space_divider}>|</p>
                    <Link to="/">to be added</Link>
                    <p className={styles.footer_space_divider}>|</p>
                    <Link to="https://github.com/skedulog" target="_blank" rel="noopener noreferrer">GitHub</Link>
                </Space>
            </FooterComponent>
        </div>
    )
}

export default Footer;