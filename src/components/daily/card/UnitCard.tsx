import { Card, Tooltip, Input, Button, Popconfirm, Empty, message } from "antd";
import { UnitCardInterface } from "../../../interfaces/daily/UnitCardInterface";
import { UnitInterface } from "../../../interfaces/schedule/ScheduleInterface";
import styles from "./UnitCard.module.scss"
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_UNIT, CREATE_UNIT } from "./UnitCard.queries";

/**
 * UnitCard 컴포넌트 뷰
 * @param {string} user 조회할 사용자 아이디
 * @param {string} loggedInUser 로그인한 사용자 아이디
 * @param {string} date 조회할 날짜
 * @param {string} today 현재 날짜
 * @param {boolean} isCreatingUnit 단위 생성중 여부
 * @param {Function} setIsCreatingUnit 단위 생성중 여부 설정
 * @param {UnitInterface} unitDisplayed 표시중인 단위
 * @param {Function} setUnitDisplayed 표시중인 단위 설정
 * @param {ScheduleInterface} currentSchedule 현재 조회중인 스케줄
 * @param {Function} updateSchedule 스케줄 수정
 * @returns {ReactNode} UnitCard 컴포넌트
 */
const UnitCard: React.FC<UnitCardInterface> = ({
    user,
    loggedInUser,
    date,
    today,
    isCreatingUnit,
    setIsCreatingUnit,
    unitDisplayed,
    setUnitDisplayed,
    currentSchedule,
    updateSchedule
}) => {

    const [getUnit, { data: getUnitData }] = useLazyQuery(GET_UNIT, {
        onCompleted: (data) => {
            if (data.unit) {
                addUnitToSchedule(data.unit);
            } else {
                createUnit({ variables: { name: unitDisplayed } });
            }
        }
    });

    const [createUnit] = useMutation(CREATE_UNIT, {
        onCompleted: (data) => {
            const units = currentSchedule?.units?.map((unit: UnitInterface) => unit.id) || [];
            units.push(data.createUnit.id);
            updateSchedule({ variables: { id: currentSchedule?.id, units }})
        }
    });

    const handleRemoveUnit = (unitId: number) => {
        const units = currentSchedule?.units?.map((unit: UnitInterface) => unit.id);
        updateSchedule({ variables: { id: currentSchedule?.id, units: units?.filter((unit: UnitInterface["id"]) => unit !== unitId) } })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsCreatingUnit(false);
            setUnitDisplayed('');
        } else if (e.key === 'Enter') {
            const regExp = /^[a-zA-Z0-9ㄱ-힣_"'\/\-`+=$!%~^&*()<>[\]{}?]+$/;
            if (!regExp.test(unitDisplayed)) {
                message.error("단위는 한글, 영어, 숫자, 특수문자('_')만 허용됩니다.", 2);
                setIsCreatingUnit(false);
                setUnitDisplayed('');
                return;
            }

            if (getUnitData?.unit?.name === unitDisplayed) {
                addUnitToSchedule(getUnitData.unit);
                return;
            }

            getUnit({ variables: { name: unitDisplayed } });
        }
    }

    const addUnitToSchedule = (unit: UnitInterface) => {
        const units = currentSchedule?.units?.map((unit: UnitInterface) => unit.id) || [];
        if (units.includes(unit.id)) {
            message.error('중복된 단위를 추가할 수 없습니다.', 2);
            setIsCreatingUnit(false);
            setUnitDisplayed('');
            return;
        }
        units.push(unit.id);
        updateSchedule({variables: { id: currentSchedule?.id, units }})
    }

    const handleNotice = () => {
        if (user === loggedInUser && date !== today) {
            message.warning("단위 수정은 오늘의 로그 페이지에서만 가능합니다.", 2);
        }
    }

    return (
        <Card 
            type="inner" 
            title="단위" 
            className={styles.card} 
            extra={(user === loggedInUser && date === today) && (isCreatingUnit ? (
                <Tooltip title="Enter를 누르면 단위가 추가됩니다." trigger={['focus']} color="blue">
                    <Input 
                        className={styles.create_unit_button}
                        autoFocus 
                        onBlur={() => {
                            setIsCreatingUnit(false);
                            setUnitDisplayed('');
                        }} 
                        onKeyDown={handleKeyDown} 
                        value={unitDisplayed} 
                        onChange={(e) => setUnitDisplayed(e.target.value)} 
                    />
                </Tooltip>
            ) : (
                <>
                    {currentSchedule?.units?.length === 10 ? (
                        <Tooltip
                            title="단위는 최대 10개까지 허용됩니다."
                            trigger={['hover']}
                            color="#fa6666"
                        >
                            <Button 
                                disabled
                                type="primary"
                            >
                                단위 추가
                            </Button>
                        </Tooltip>
                    ) : (
                        <Button
                            type="primary"
                            onClick={() => setIsCreatingUnit(true)}
                        >
                            단위 추가
                        </Button>
                    )}
                </>
                
            ))}
        >
            {currentSchedule?.units?.length ? currentSchedule.units.map((unit: UnitInterface) => {
                return (user === loggedInUser && date === today) ? (
                    <Popconfirm 
                        key={`unit${unit.id}`}
                        title="단위 삭제"
                        description="해당 단위를 삭제하겠습니까?"
                        onConfirm={() => handleRemoveUnit(unit.id ?? 0)}
                        okText="확인"
                        cancelText="취소"
                    >
                        <Button size="large" type="dashed">{unit.name}</Button>
                    </Popconfirm>
                ) : (
                    <Button key={`unit${unit.id}`} size="large" type="dashed" onClick={handleNotice}>{unit.name}</Button>
                )
            }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Card>
    )
}

export default UnitCard;