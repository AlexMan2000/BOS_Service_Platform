import { RightCardType } from "@/commons/types/right"
import styles from "./RightsGridPage.module.less"
import { RightCard } from "../cards/RightCard"
import { useEffect, useState } from "react"
import { getAllRights } from "@/services/benefitApi"
import { ResponseCode } from "@/commons/defs/code"
import { message } from "antd"
import { getUserBalance } from "@/services/accountApi"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, setUserInfo } from "@/store/slice/userSlice/userSlice"

export const RightsGridPage = () => {


    const [rightsCard, setRightsCard] = useState<RightCardType[]>([])
    const dispatch = useDispatch()
    const { userId } = useSelector(selectUser)

    const fetchData = async () => {
        const commonResult = await getAllRights({ pageNum: 0, pageSize: 10 });
        if (commonResult.code === ResponseCode.SUCCESS) {
            setRightsCard(commonResult.data as RightCardType[])
        } else {
            message.error(commonResult.message)
        }
        const balance = await getUserBalance(userId)
        if (balance.code === ResponseCode.SUCCESS) {

            dispatch(setUserInfo({
                balance: balance.data as number
            }))
        }
    }



    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div className={styles.container}>
            {rightsCard && rightsCard.length > 0 && rightsCard.map((card) => (
                <RightCard key={card.name} {...card} onSubmit={async () => {
                    await fetchData()
                }} />
            ))}
        </div>
    )
}
