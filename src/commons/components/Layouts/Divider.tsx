
import styles from './Divider.module.less';


interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    style?: React.CSSProperties;
}

export const Divider = ({ className, style, orientation = 'horizontal' }: DividerProps) => {
    return <div className={`${styles.container} ${className} ${orientation === 'vertical' ? styles.vertical : styles.horizontal}`} style={style} />;
};

export default Divider;
