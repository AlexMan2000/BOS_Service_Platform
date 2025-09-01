import { Breadcrumb } from "antd";
import styles from "./BreadCrumb.module.less"
import { Link, useLocation } from "react-router-dom";

export const BreadCrumb = ({ items }: { items: { pathname: string, crumb: string }[] }) => {
    const location = useLocation();

    // Find the index of the current path or the deepest visited path
    const currentIndex = items.findIndex(item => item.pathname === location.pathname);
    const visibleItems = currentIndex >= 0 ? items.slice(0, currentIndex + 1) : items.slice(0, 1);

    // 判断当前是否在详情页面
    const isInAdminProjectDetail = location.pathname.includes('/admin/activities-management/activity-detail/project-detail');
    const isInUserProjectDetail = location.pathname.includes('/home/activities/projects/detail');
    
    // 构建新的items格式
    const breadcrumbItems = visibleItems.map((it, i) => {
        const isLast = i === visibleItems.length - 1;
        const isActive = location.pathname === it.pathname;
        
        // 判断是否应该禁用链接
        let shouldDisableLink = false;
        
        // 管理员页面：在project-detail页面时，禁用"活动详情"链接
        if (isInAdminProjectDetail && 
            it.crumb === "活动详情" && 
            it.pathname.includes("activity-detail")) {
            shouldDisableLink = true;
        }
        
        // 用户页面：在作品详情页面时，禁用"活动详情"链接
        if (isInUserProjectDetail && 
            it.crumb === "活动详情" && 
            it.pathname.includes("/home/activities/projects")) {
            shouldDisableLink = true;
        }
        
        return {
            key: it.pathname,
            title: isLast || isActive || shouldDisableLink ? (
                <span className={`${isActive ? styles.active : ''} ${shouldDisableLink ? styles.disabled : ''}`}>
                    {it.crumb}
                </span>
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
