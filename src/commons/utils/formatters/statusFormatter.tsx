import { CheckCircleOutlined, ClockCircleOutlined, StopOutlined, InfoCircleOutlined } from "@ant-design/icons"

export interface StatusInfo {
    text: string
    color: string
    icon: JSX.Element
}

/**
 * 根据活动状态值获取对应的显示信息
 * @param status 状态值：0=未开始, 1=进行中, 2=已结束
 * @returns 包含文本、颜色和图标的状态信息
 */
export const getActivityStatusInfo = (status: string | number): StatusInfo => {
    const statusNum = Number(status)
    
    // 处理数字状态值
    if (!isNaN(statusNum)) {
        switch (statusNum) {
            case 0:
                return {
                    text: '未开始',
                    color: 'orange',
                    icon: <ClockCircleOutlined />
                }
            case 1:
                return {
                    text: '进行中',
                    color: 'green',
                    icon: <CheckCircleOutlined />
                }
            case 2:
                return {
                    text: '已结束',
                    color: 'red',
                    icon: <StopOutlined />
                }
            default:
                return {
                    text: '未知状态',
                    color: 'default',
                    icon: <InfoCircleOutlined />
                }
        }
    }
    
    // 兼容字符串状态值（向后兼容）
    switch (status) {
        case 'active':
            return {
                text: '进行中',
                color: 'green',
                icon: <CheckCircleOutlined />
            }
        case 'inactive':
            return {
                text: '已结束',
                color: 'red',
                icon: <StopOutlined />
            }
        case 'pending':
            return {
                text: '待开始',
                color: 'orange',
                icon: <ClockCircleOutlined />
            }
        case 'cancelled':
            return {
                text: '已取消',
                color: 'default',
                icon: <StopOutlined />
            }
        default:
            return {
                text: status as string,
                color: 'blue',
                icon: <InfoCircleOutlined />
            }
    }
}

/**
 * 获取状态颜色
 * @param status 状态值
 * @returns Ant Design Tag 组件的颜色值
 */
export const getActivityStatusColor = (status: string | number): string => {
    return getActivityStatusInfo(status).color
}

/**
 * 获取状态文本
 * @param status 状态值
 * @returns 状态的中文描述
 */
export const getActivityStatusText = (status: string | number): string => {
    return getActivityStatusInfo(status).text
}

/**
 * 获取状态图标
 * @param status 状态值
 * @returns React 图标组件
 */
export const getActivityStatusIcon = (status: string | number): JSX.Element => {
    return getActivityStatusInfo(status).icon
}
