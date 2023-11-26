import { Space, Typography, Button } from "antd";
import { useState, useEffect } from "react";
import logo from "../../images/skedulog_no_bg_underline.png"
import styles from "./MainView.module.scss";
import { Link } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const { Title, Text } = Typography;

const MainView: React.FC = () => {

    const { setTitle } = useDocumentTitle();
    useEffect(() => {
        setTitle('');
    }, [])
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <div className={styles.main_container}>
            <div className={styles.main_content}>
                <div className={styles.main_logo}>
                    <img src={logo} />
                </div>
                <div className={styles.main_text}>
                    <Title level={1}>재미있고 효율적인 스케줄 관리!</Title>
                    <Space direction="vertical">
                        <Text type="secondary" className={styles.bullet_points}>일별 스케줄 관리</Text>
                        <Text type="secondary" className={styles.bullet_points}>친구들과 스케줄 공유</Text>
                        <Text type="secondary" className={styles.bullet_points}>키워드로 스케줄 관리</Text>
                        <Text type="secondary" className={styles.bullet_points}>키워드별 통계</Text>
                        <Text type="secondary" className={styles.bullet_points}>인기 키워드 및 연관 키워드 검색</Text>
                    </Space>
                </div>
                <div className={styles.main_button}>
                    <Button 
                        size="large" 
                        className={hovered ? styles.hovered_button : ""} 
                        onMouseEnter={handleMouseEnter} 
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link to="/signup">
                            회원가입
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MainView;