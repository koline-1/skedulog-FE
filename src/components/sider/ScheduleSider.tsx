import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";
import { ScheduleSiderInterface } from "../../interfaces/sider/ScheduleSiderInterface";
import { useLazyQuery } from "@apollo/client";
import styles from "./ScheduleSider.module.scss";
import { ScheduleInterface } from "../../interfaces/schedule/ScheduleInterface";
import { LineChartOutlined, PlusSquareOutlined, CloseCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { getUsername } from "../../cookie/Cookie";
import React from "react";
import { ALL_SCHEDULES_BY_MEMBER } from "./ScheduleSider.queries";

const { Sider } = Layout;

const ScheduleSider: React.FC<ScheduleSiderInterface> = ({ createdBy, createdAt, collapsed, scheduleId, position, onEmpty }) => {

    const navigate = useNavigate();

    const [getAllSchedulesByMember, { loading }] = useLazyQuery(ALL_SCHEDULES_BY_MEMBER, {
        onCompleted: (data) => {
            const itemList: MenuItemType[] = [{
                key: 'Home',
                label: (
                    <span
                        onClick={() => handleNavigate(0)}
                    >
                        Home
                    </span>
                ),
                icon: <HomeOutlined onClick={() => handleNavigate(0)} />,
            }]

            itemList.push(...(data?.allSchedulesByMember.map((scheduleDepth1: ScheduleInterface) => {
                return {
                    key: `${scheduleDepth1.id}`,
                    label: (
                        <span
                            onClick={() => handleNavigate(scheduleDepth1.id)}
                            className={styles.schedule_depth1}
                        >
                            {scheduleDepth1.name}
                        </span>
                    ),
                    icon: <LineChartOutlined onClick={() => handleNavigate(scheduleDepth1.id)} />,
                    children: scheduleDepth1.scheduleData?.map((scheduleDepth2: ScheduleInterface) => {
                        return {
                            key: `${scheduleDepth2.id}`,
                            label: (
                                <span
                                    onClick={() => handleNavigate(scheduleDepth2.id)}
                                    className={styles.schedule_depth2}
                                >
                                    {scheduleDepth2.name}
                                </span>
                            ),
                            icon: <div></div>,
                            children: scheduleDepth2.scheduleData?.map((scheduleDepth3: ScheduleInterface) => {
                                return {
                                    key: `${scheduleDepth3.id}`,
                                    label: (
                                        <span
                                            onClick={() => handleNavigate(scheduleDepth3.id)}
                                            className={styles.schedule_depth3}
                                        >
                                            {scheduleDepth3.name}
                                        </span>
                                    ),
                                    icon: <div></div>,
                                    children: scheduleDepth3.scheduleData?.map((scheduleDepth4: ScheduleInterface) => {
                                        return {
                                            key: `${scheduleDepth4.id}`,
                                            label: (
                                                <span
                                                    onClick={() => handleNavigate(scheduleDepth4.id)}
                                                    className={styles.schedule_depth4}
                                                >
                                                    {scheduleDepth4.name}
                                                </span>
                                            ),
                                            icon: <div></div>,
                                            children: scheduleDepth4.scheduleData?.map((scheduleDepth5: ScheduleInterface) => {
                                                return {
                                                    key: `${scheduleDepth5.id}`,
                                                    label: (
                                                        <span
                                                            onClick={() => handleNavigate(scheduleDepth5.id)}
                                                            className={styles.schedule_depth5}
                                                        >
                                                            {scheduleDepth5.name}
                                                        </span>
                                                    ),
                                                    icon: <div></div>,
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })))

            setItems(itemList);
        } 
    });

    const [items, setItems] = useState<MenuItemType[]>([]);

    useEffect(() => {
        (createdBy && createdAt) && getAllSchedulesByMember({ variables: { createdBy, createdAt } });
    }, [createdBy, createdAt])

    const emptyMenuTab: MenuItemType[] = createdBy === getUsername() ? [{
        key: "no-item-self",
        label: <a onClick={onEmpty || (() => {})}>스케줄을 추가해보세요!</a>,
        icon: <PlusSquareOutlined />
    }] : [{
        key: "no-item-other",
        label: <a>등록된 일정이 없습니다.</a>,
        icon: <CloseCircleOutlined />
    }]

    const handleNavigate = (id: number) => {
        navigate(`/schedule/daily?user=${createdBy}&date=${createdAt}` + (id ? `&scheduleId=${id}` : ''));
    }

    return (
        <div className={styles.relative}>
            {!loading && 
                <Sider 
                    className={`${styles.sider} ${styles.sider_fixed} ${collapsed ? styles.sider_collapsed : styles.sider_open}`} 
                    collapsible 
                    collapsed={collapsed ? collapsed : false} 
                    trigger={null} 
                    style={{ background: 'white', position: 'fixed'}}
                >
                    <div 
                        className={`${styles.menu_container} ${styles.sider_fixed} ${collapsed ? styles.sider_collapsed : styles.sider_open}`}
                        style={{height: `calc(100vh - 3.75rem - ${position > 96 ? 0 : 96-position}px)`}}
                    >
                        <Menu 
                            className={styles.sider_menu}
                            selectedKeys={[scheduleId || 'Home']} 
                            mode="inline" 
                            items={items.length !== 1 ? items : emptyMenuTab}
                        />
                    </div>
                </Sider>
            }
        </div>
    );
}

export default ScheduleSider;