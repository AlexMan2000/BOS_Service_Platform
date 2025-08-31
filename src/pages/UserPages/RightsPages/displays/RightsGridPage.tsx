import { RightCardType } from "@/commons/types/right"
import styles from "./RightsGridPage.module.less"
import { RightCard } from "../cards/RightCard"
import { useEffect, useState } from "react"
import { getAllRights } from "@/services/benefitApi"

export const RightsGridPage = () => {


    const [rightsCard, setRightsCard] = useState<RightCardType[]>([])

    const RIGHTS_CARDS: RightCardType[] = [
        {
            id: 1,
            name: "权益1",
            description: "权益1描述",
            price: 100,
            image: "https://picsum.photos/200/300",
            total: 100,
            remain: 100,
            active: true,
            expDate: "2021-01-01"
        },  
        {
            id: 2,
            name: "权益2",
            description: "权益2描述",
            price: 200,
            image: "https://picsum.photos/300/400",
            total: 200,
            remain: 200,
            active: true,
            expDate: "2021-01-01"
        }
    ]

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllRights({pageNum: 0, pageSize: 10});
            setRightsCard(data as RightCardType[])
        }
        fetchData()
    }, [])

    return (
        <div className={styles.container}>
            {RIGHTS_CARDS.map((card) => (
                <RightCard key={card.name} {...card} />
            ))}
        </div>
    )
}
