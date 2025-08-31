
import { Button, Form, Input, Modal } from "antd"
import coverImage from '@/assets/loginCover.png'
import styles from "./LoginPage.module.less"
import { useNavigate } from "react-router-dom"
import { ResponseCode } from "@/commons/defs/code"
import { setUserInfo } from "@/store/slice/userSlice/userSlice"
import { useDispatch } from "react-redux"
import { changePassword } from "@/services/userApi"
import { message } from "antd"
import { useState } from "react"
import { loginUser } from "@/services/userApi"
import { CommonResult } from "@/commons/types/response"
import { User } from "@/commons/types/user"

export const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
    const handleLogin = async (values: any) => {
            // const commonResult = await loginUser(values) as CommonResult<User>  
            const commonResult = {
                code: ResponseCode.FIRST_LOGIN,
                message: "成功",
                data: {
                    role: "USER"
                }
            }
        if (commonResult.code === ResponseCode.SUCCESS) {
            const userInfo = commonResult.data;
            dispatch(setUserInfo({
                ...userInfo,
            }))

            const role = userInfo.role;
            if (role === "USER") {
                navigate("/home")
            } else if (role === "ADMIN") {
                navigate("/admin")
            }
            setIsChangePasswordModalOpen(true)
        } else if (commonResult.code === ResponseCode.FIRST_LOGIN) {
            message.info(commonResult.message + ", 用户首次登录， 请修改密码!")
            setIsChangePasswordModalOpen(true)
        }
        else if (commonResult.code === ResponseCode.FAILED) {
            message.error(commonResult.message + ", 用户提供的凭证信息有误!")
        }
    }

    const handleChangePassword = async () => {
        console.log(newPassword)
        if (newPassword.length < 6) {
            message.error("密码长度不能小于6位!")
            return
        }
        if (newPassword.length > 16) {
            message.error("密码长度不能大于16位!")
            return
        }
        if (newPassword !== confirmPassword) {
            message.error("密码不一致!")
            return
        }
        setIsChangePasswordModalOpen(false)
        const commonResult = await changePassword({newPassword: newPassword});
        if (commonResult.code === ResponseCode.SUCCESS) {
            message.success("密码修改成功!")
            navigate("/")
        } else if (commonResult.code === ResponseCode.FAILED) {
            message.error(commonResult.message + ", 密码修改失败!")
        }
        
    }

    return (
        <div className={styles.container}>
            <Modal 
                title="修改密码"
                open={isChangePasswordModalOpen} 
                onCancel={() => {  
                    setIsChangePasswordModalOpen(false) 
                    setNewPassword("")
                    setConfirmPassword("")
                }}
                footer={[
                    <Button key="cancel" onClick={() => { 
                        setIsChangePasswordModalOpen(false);
                        setNewPassword("");
                        setConfirmPassword("");
                    }}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleChangePassword}>
                        确定
                    </Button>,
                ]}
                width={500}
            >
                <Form
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ marginTop: 20 }}
                >
                    <Form.Item
                        label="新密码"
                        required
                    >
                        <Input.Password 
                            placeholder="请输入新密码" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="确认密码"
                        required
                    >
                        <Input.Password 
                            placeholder="请再次输入新密码" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </Form.Item>
                </Form>
            </Modal>
               
            <div className={styles.loginRegion}>
                <div className={styles.loginTitle}>
                    <span className={styles.loginTitleText}>稳定币奖励平台</span>
                </div>
                <div className={styles.loginForm}>
                    <Form layout="vertical"
                        onFinish={handleLogin}
                    >
                        <Form.Item label="工号"  name="employeeNo" rules={[{  validator: (_, value, callback) => {
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