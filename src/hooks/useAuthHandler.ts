import { loginUser } from "@/services/api/authApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken, setIsAuthenticated, setUserInfo } from "@/store/slice/userSlice/userSlice";
import { getUserInfo } from "@/services/api/authApi";
import { wait } from "@/commons/utils/sys_utils";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const useAuthHandler = (side_effect: Function) => {


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [gotUserInfo, setGotUserInfo] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleLogin = async (login_form: any) => {
        try {
            setIsSubmitting(true);
            const res = await loginUser(login_form);
            setShowSuccess(false);

            if (res.isAuthenticated) {
                localStorage.setItem("access_token", res["access_token"]);
                dispatch(setAccessToken(res["access_token"]));
                dispatch(setIsAuthenticated(true));

                try {
                    setGotUserInfo(false);
                    const userInfo = await getUserInfo(res["user_id"]);
                    setGotUserInfo(true);
                    dispatch(setUserInfo({
                        ...userInfo,
                        geo_location: userInfo["geographic_location"],
                        user_id: res["user_id"],
                    }));
                    await wait(0.25)
                    setShowSuccess(true);
                    setIsSubmitting(false);
                    await wait(1.25);
                    side_effect();
                    setShowSuccess(false);
                } catch (e) {
                    messageApi.open({
                        type: 'error',
                        content: 'Error fetching user info',
                        style: {
                            marginTop: '10vh',
                        },
                    });
                    setGotUserInfo(false);
                    setIsSubmitting(false);
                    return;
                }
            } else {
                if (res.status == 401) {
                    messageApi.open({
                        type: 'error',
                        content: 'You have entered an incorrect password',
                        style: {
                            marginTop: '10vh',
                        },
                    });
                } else if (res.status == 403) {
                    messageApi.open({
                        type: 'error',
                        content: 'Email not verified',
                        style: {
                            marginTop: '10vh',
                        },
                    });
                } else if (res.status == 408) {
                    messageApi.open({
                        type: 'error',
                        content: 'Backend server is not connected',
                        style: {
                            marginTop: '10vh',
                        },
                    });
                } else if (res.status == 422) {
                    messageApi.open({
                        type: 'error',
                        content: 'Password too short',
                        style: {
                            marginTop: '10vh',
                        },
                    });
                } else if (res.status == 454) {
                    messageApi.open({
                        type: 'error',
                        content: 'User not registered',
                        style: {
                            marginTop: '10vh',
                        },
                    });
                } else if (res.status == 500) {
                    messageApi.open({
                        type: 'error',
                        content: 'Unexpected Error',
                        style: {
                            marginTop: '10vh',
                        },
                    });
                }
                setIsSubmitting(false);
            }
        } catch (e) {
            console.log(e);
            console.log("Here!~!!!!")
            setIsSubmitting(false);
            navigate("/")
        }
    }

    return {
        handleLogin,
        isSubmitting,
        showSuccess,
        gotUserInfo,
        contextHolder
    }


}