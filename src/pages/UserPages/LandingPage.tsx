import styles from './LandingPage.module.less'
import { Outlet } from 'react-router-dom'


export const LandingPage = () => {
    return (
        <div className={styles.container}>
            <Outlet />
        </div>
    )
}