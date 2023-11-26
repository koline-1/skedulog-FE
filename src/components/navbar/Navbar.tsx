import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuInterface } from "../../interfaces/menu/MenuInterface";
import { Dropdown, MenuProps, Typography, message } from "antd";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import logo from "../../images/skedulog_no_bg_underline.png";
import searchImage from "../../images/magnifier.png";
import styles from "./Navbar.module.scss";
import { RootStateInterface } from "../../interfaces/state/RootStateInterface";
import { useApolloClient, useMutation } from "@apollo/client";
import { removeStoredMemberData } from "../../handlers/UtilityHandlers";
import { common, auth } from "../../json/Menu.json";
import { getUsername } from "../../cookie/Cookie";
import { LOG_OUT } from "./Navbar.queries";

const { Text } = Typography;

const anonymousMenu: MenuInterface[] = [...common];
anonymousMenu.push(auth.logIn);

const authenticatedMenu: MenuInterface[] = [...common];
const userInfoMenu: MenuInterface = { key: "userInfo" };
userInfoMenu.children = [auth.member, auth.logOut,];
authenticatedMenu.push(userInfoMenu);

const Navbar: React.FC = () => {

    const [menu, setMenu] = useState<MenuInterface[]>(anonymousMenu);
    const [mouseOver, setMouseOver] = useState<string|null>();
    const isAuthenticated = useSelector((state: RootStateInterface) => !!state.authToken.accessToken);
    const [logOut] = useMutation(LOG_OUT, {
        onCompleted: (data) => {
            if (data) {console.log(data)
                removeStoredMemberData();
                client.cache.evict({ id: 'ROOT_QUERY', fieldName: 'member' })
                client.cache.gc();
                message.success('로그아웃 되셨습니다.', 2);
                navigate('/');
            }
        }
    })
    const client = useApolloClient();
    const navigate = useNavigate();
    const location = useLocation();
    const username = getUsername();

    useEffect(() => {
        isAuthenticated ? setMenu(authenticatedMenu) : setMenu(anonymousMenu);
    }, [isAuthenticated])

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;

            // @TODO 검색 처리 로직
            console.log(target.value);
        }
    }

    const handleLogOut = () => {
        logOut();
    }

    const items: MenuProps['items'] = userInfoMenu.children?.map(child => {
        return {
            key: `${child.key}`,
            label: child.key === 'logOut' ? (
                <a onClick={handleLogOut} onMouseOver={() => setMouseOver(userInfoMenu.key)} onMouseLeave={() => setMouseOver(null)}>
                    <Text>
                        {child.text}
                    </Text>
                </a>
            ) : (
                <Link to={child.link || ''} key={child.key} onMouseOver={() => setMouseOver(userInfoMenu.key)} onMouseLeave={() => setMouseOver(null)}>
                    <Text>
                        {child.text}
                    </Text>
                </Link>
            )
        }
    })

    const isKeyMatched = (key: string) => {
        return mouseOver === key;
    }

    const isLinkMatched = (links: string[]) => {
        return links.includes(location.pathname);
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">
                    <img src={logo} />
                </Link>
            </div>
            <div className={styles.search_box}>
                <div>
                    <img className={styles.search_icon} src={searchImage} alt="" />
                </div>
                <div className={styles.search_input_container}>
                    <input className={styles.search_input} type="text" placeholder="키워드를 입력하세요" onKeyDown={handleSearch} />
                </div>
            </div>
            <div className={styles.menu}>
                {menu.map((each: MenuInterface, index: number) => {
                    return each.children ? (
                        <Dropdown 
                            key={each.key}
                            menu={{items}}
                            arrow={true}
                        >
                            <a
                                key={index} 
                                className={`${styles.menu_item} ${styles.menu_item_text} ${each.key === 'userInfo' ? styles.user_info : ''} ` 
                                        +  `${(isKeyMatched(each.key) || isLinkMatched(['/password/check', '/member/me'])) ? styles.menu_item_text_hovered : ''}`} 
                                onMouseOver={() => setMouseOver(each.key)} 
                                onMouseLeave={() => setMouseOver(null)}
                            >
                                @{username}
                                <div className={`${styles.underline} ${(isKeyMatched(each.key) || isLinkMatched(['/password/check', '/member/me'])) ? styles.underline_hovered : ''}`}></div>
                            </a>
                        </Dropdown>
                    ) : (
                        <Link 
                            key={index} 
                            to={each.link || '/'} 
                            className={`${styles.menu_item}`} 
                            onMouseOver={() => setMouseOver(each.key)} 
                            onMouseLeave={() => setMouseOver(null)}
                        >
                            <Text className={`${styles.menu_item_text} ${(isKeyMatched(each.key) || isLinkMatched([each.link || ''])) ? styles.menu_item_text_hovered : ''}`}>
                                {each.text}
                            </Text>
                            <div className={`${styles.underline} ${(isKeyMatched(each.key) || isLinkMatched([each.link || ''])) ? styles.underline_hovered : ''}`}></div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

export default Navbar;