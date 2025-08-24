import { RightCardType } from "@/commons/types/right"
import styles from "./RightsGridPage.module.less"
import { RightCard } from "../cards/RightCard"

export const RightsGridPage = () => {


    const RIGHTS_CARDS: RightCardType[] = [
        {
            name: "权益1",
            description: "权益1描述",
            price: 100,
            image: "https://picsum.photos/200/300",
            total: 100,
            remain: 100,
            active: true,
            exp_date: "2021-01-01"
        },  
        {
            name: "权益2",
            description: "权益2描述",
            price: 200,
            image: "https://picsum.photos/300/400",
            total: 200,
            remain: 200,
            active: true,
            exp_date: "2021-01-01"
        }
    ]

    return (
        <div className={styles.container}>
            {RIGHTS_CARDS.map((card) => (
                <RightCard key={card.name} {...card} />
            ))}
        </div>
    )
}
