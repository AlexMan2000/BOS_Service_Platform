import { Input, Select } from "antd";
import { countryCodes, countryCodesZh } from "@/commons/defs/countryCode";
import styles from "./PhoneNumberInput.module.less";
import { selectGlobalState } from "@/store/slice/globalSlice/globalSlice";
import { useSelector } from "react-redux";
interface PhoneNumberInputProps {
    initialValues?: {
        phoneNumber: string | undefined;
        codeRegion: string;
    };
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    onPhoneNumberChange: (phoneNumber: string) => void;
    onRegionChange: (codeRegion: string) => void;
    inputStyle?: React.CSSProperties;
    selectStyle?: React.CSSProperties;
    placeholder?: string;   
}

const PhoneNumberInput = ({ 
    initialValues, 
    onPhoneNumberChange, 
    onRegionChange, 
    inputStyle, 
    selectStyle,
    disabled = false
}: PhoneNumberInputProps) => {


    const {Option} = Select;
    const locale = useSelector(selectGlobalState).locale;

    const addRegionBefore = (
        <Select
            style={selectStyle}
            value={initialValues?.codeRegion}
            onChange={(value) => {
                onRegionChange(value);
            }}
        >
            {(locale === "zh" ? countryCodesZh : countryCodes).map((item) => (
                <Option key={item.id} value={item.code}>
                    {item.code} ({item.country})
                </Option>
            ))}
        </Select>
    );

    return (
        <div className={styles.container}>
            <Input
                disabled={disabled}
                value={initialValues?.phoneNumber}
                addonBefore={addRegionBefore}
                className={styles.devOnlyPhoneNumberInput}
                style={inputStyle}
                placeholder={(locale === "zh" ? countryCodesZh : countryCodes).find(item => item.code === initialValues?.codeRegion)?.placeholder}
                onChange={(e) => {
                    onPhoneNumberChange(e.target.value);
                }}
              />
        </div>
    );
};

export default PhoneNumberInput;