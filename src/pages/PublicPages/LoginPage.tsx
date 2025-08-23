

import { Button, Form, Input } from "antd"
import coverImage from '@/assets/loginCover.png'
import styles from "./LoginPage.module.less"

export const LoginPage = () => {

    const handleLogin = (values: any) => {
        console.log('login', values)
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginRegion}>
                <div className={styles.loginTitle}>
                    <span className={styles.loginTitleText}>稳定币奖励平台</span>
                </div>
                <div className={styles.loginForm}>
                    <Form layout="vertical"
                        onFinish={handleLogin}
                    >
                        <Form.Item label="工号"  name="username" rules={[{  validator: (_, value, callback) => {
                            if (!value) {
                                callback('请输入工号')
                            }
                            if (value.length !== 6) {
                                callback('工号长度为6位')
                            }
                            if (isNaN(Number(value))) {
                                callback('工号必须为纯数字')
                            }
                            callback()
                        } }]}>
                            <Input placeholder="Username" />
                        </Form.Item>
                        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">登录</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className={styles.imageRegion}>
                <img src={coverImage} alt="login-bg" />
            </div>
        </div>
    )
}