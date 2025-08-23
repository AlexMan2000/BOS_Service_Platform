import { Breadcrumb } from "antd";
import styles from "./BreadCrumb.module.less"
import { Link, useLocation } from "react-router-dom";

export const BreadCrumb = ({ items }: { items: { pathname: string, crumb: string }[] }) => {
    const location = useLocation();

    // Find the index of the current path or the deepest visited path
    const currentIndex = items.findIndex(item => item.pathname === location.pathname);
    const visibleItems = currentIndex >= 0 ? items.slice(0, currentIndex + 1) : items.slice(0, 1);

    return (
        <div className={styles.container}>
            <Breadcrumb>
                {visibleItems.map((it, i) => {
                    const isLast = i === visibleItems.length - 1;
                    const isActive = location.pathname === it.pathname;
                    return (
                        <Breadcrumb.Item key={it.pathname} className={isActive ? styles.active : ''}>
                            {isLast || isActive ? it.crumb : <Link to={it.pathname}>{it.crumb}</Link>}
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        </div>
    )
}
