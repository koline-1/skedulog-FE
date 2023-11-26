import { PageInformationInterface } from "../../interfaces/pageinformation/PageInformationInterface";
import { Typography } from "antd";
import styles from "./PageTitle.module.scss";

const { Title } = Typography;

const PageTitle: React.FC<PageInformationInterface> = ({ title, level, className }) => {

    return (
        <div className={`${styles.page_title_container} ${className}`}>
            <Title level={level ?? 2}>{title}</Title>
        </div>
    )
}

export default PageTitle;