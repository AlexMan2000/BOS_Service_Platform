import { useAppDispatch } from "@/store/rootHooks";
import { selectGlobalState } from "@/store/slice/globalSlice/globalSlice";
import { setLocale } from "@/store/slice/globalSlice/globalSlice";
import { Select } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import LanguageIcon from "@/assets/icons/language.png"



const LanguageSwitcher = (props: { style?: React.CSSProperties, className?: string }) => {

    const dispatch = useAppDispatch();
    const { locale } = useSelector(selectGlobalState)
    const [language, setLanguage] = useState<string>(locale);

    const handleChange = (newLocale) => {
        setLanguage(newLocale)
        dispatch(setLocale({ locale: newLocale }))
    };


    return (
        <div className={`${props.className}`} style={{
            fontSize: "10px",
            width: "110px",
            height: "35px",
            // border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "0 5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            ...props.style
        }}>
            <img style={{ width: "20px", height: "20px" }} src={LanguageIcon}></img>

            <Select
                id="language-select"
                value={language}
                onChange={handleChange}
                options={
                    [{ value: "zh", label: "简体中文" },
                    { value: "en", label: "English" }]}
            >
            </Select>
        </div>
    );
};

export default LanguageSwitcher;