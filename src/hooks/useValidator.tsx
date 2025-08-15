import { countryCodes } from "@/commons/defs/countryCode";

const VALID_RANGE_REGEX = /^\d+(\.\d+)?[MBT]\s*~\s*\d+(\.\d+)?[MBT]$/;
const VALID_NUMBER_REGEX = /^\d+(\.\d+)?$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s-]{8,}$/;  // Basic international phone format
const WECHAT_REGEX = /^[a-zA-Z][\w-]{5,19}$/;  // WeChat ID format

export const useValidator = () => {
    const currencyRangeValidator = {
        validator: async (_, value) => {
            console.log(value)
            if (!value) {
                throw new Error('Please enter a valid number, this field is required');
            }
            if (value?.value) {
                if (!VALID_NUMBER_REGEX.test(value.value)) {
                    throw new Error('Please enter a valid number');
                }
            } else {

                if (!value?.valueDesc || (value.valueDesc && !value.valueDesc.trim())) {
                    throw new Error('Please select or enter a range');
                }
                // Check if input is a range (contains ~) or a single number
                if (value.valueDesc.includes('~')) {
                    // Validate range format
                    if (!VALID_RANGE_REGEX.test(value.valueDesc)) {
                        throw new Error('Please enter a valid range format (e.g., 1M ~ 5M)');
                    }
                } else {
                    // Validate single number format
                    console.log(value.valueNumber)
                    if (!VALID_NUMBER_REGEX.test(value.valueNumber)) {
                        throw new Error('Please enter a valid number');
                    }
                    // Optional: Add additional validation for number size if needed
                    const num = parseFloat(value.valueNumber);
                    if (num <= 0) {
                        throw new Error('Please enter a number greater than 0');
                    }
                }
            }
        },
        validateTrigger: 'onBlur'
    };

    const contactInfoValidator = (contactMethod: string, codeRegion?: string, locale?: string) => ({

        validator: async (_, value) => {
            switch (contactMethod?.toLowerCase()) {
                case 'email':
                    if (!EMAIL_REGEX.test(value)) {
                        throw new Error(locale === "zh" ? "请输入有效的电子邮件地址" : "Please enter a valid email address");
                    }
                    break;
                case 'phone':
                    if (!codeRegion) {
                        if (!PHONE_REGEX.test(value)) {
                            throw new Error(locale === "zh" ? "请输入有效的电话号码" : "Please enter a valid phone number");
                        }
                    } else {

                        const country = countryCodes.find((c) => c.code === codeRegion);
                        if (!country) throw new Error(locale === "zh" ? "无效的国家代码" : "Invalid country code");

                        const regex = country.pattern;
                        if (value &&!regex.test(value)) throw new Error(locale === "zh" ? "无效的电话号码格式" : "Invalid phone number format w.r.t country code");

                        return Promise.resolve();
                    }

                    break;
                case 'wechat':
                    if (!WECHAT_REGEX.test(value)) {
                        throw new Error(locale === "zh" ? "请输入有效的微信ID" : "Please enter a valid WeChat ID");
                    }
                    break;
                default:
                    break;
            }
        },
        validateTrigger: 'onBlur'
    });


    const emailValidator = (sideEffect?: (value: string) => void, locale?: string) => ({
        validator: async (_, value) => {
            sideEffect?.(value);

            if (!value) {
                return Promise.reject(locale === "zh" ? "电子邮件不能为空" : "Email is required");
            }
            if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/g.test(value)) {
                return Promise.reject(locale === "zh" ? "无效的电子邮件格式" : "Invalid email format");
            }
            return Promise.resolve();
        },
        // validateTrigger: 'onBlur'
    });

    const passwordValidator = (sideEffect?: (value: string) => void, locale?: string) => ({
        validator: async (_, value) => {
            sideEffect?.(value);

            // If the password is empty, don't show requirements error
            if (!value) {
                return Promise.resolve();
            }

            // Check if all requirements are met
            const uppercaseRegex = /[A-Z]/;
            const digitRegex = /\d/;
            const specialCharRegex = /[@$!%*?&]/;
            const minLengthRegex = /.{8,}/;

            const hasUppercase = uppercaseRegex.test(value);
            const hasDigit = digitRegex.test(value);
            const hasSpecialChar = specialCharRegex.test(value);
            const hasMinLength = minLengthRegex.test(value);

            const allMet = hasUppercase && hasDigit && hasSpecialChar && hasMinLength;

            if (!allMet) {
                return Promise.reject(locale === "zh" ? "密码不符合所有要求" : "Password does not meet all requirements");
            }

            return Promise.resolve();

        },
    });

    const confirmPasswordValidator = (targetPassword: string, sideEffect?: (value: string) => void, locale?: string) => ({
        validator: async (_, value) => {
            sideEffect?.(value);

            if (!value) {
                return Promise.reject(locale === "zh" ? "请确认密码" : "Please confirm your password");
            }

            if (value !== targetPassword) {
                return Promise.reject(locale === "zh" ? "密码不匹配" : "Passwords do not match");
            }

            return Promise.resolve();
        },
    });

    return {
        currencyRangeValidator,
        contactInfoValidator,
        emailValidator,
        passwordValidator,
        confirmPasswordValidator
    };
};
