import { Breadcrumb } from "antd";
import styles from "./BreadCrumb.module.less"
import { Link, useLocation } from "react-router-dom";

export const BreadCrumb = ({ items }: { items: { pathname: string, crumb: string }[] }) => {
    const location = useLocation();

    // Find the index of the current path or the deepest visited path
    const currentIndex = items.findIndex(item => item.pathname === location.pathname);
    const visibleItems = currentIndex >= 0 ? items.slice(0, currentIndex + 1) : items.slice(0, 1);

    // 构建新的items格式
    const breadcrumbItems = visibleItems.map((it, i) => {
        const isLast = i === visibleItems.length - 1;
        const isActive = location.pathname === it.pathname;
        
        return {
            key: it.pathname,
            title: isLast || isActive ? (
                <span className={isActive ? styles.active : ''}>{it.crumb}</span>
            ) : (
                <Link to={it.pathname} className={styles.link}>{it.crumb}</Link>
            ),
        };
    });

    return (
        <div className={styles.container}>
            <Breadcrumb items={breadcrumbItems} />
        </div>
    )
}
