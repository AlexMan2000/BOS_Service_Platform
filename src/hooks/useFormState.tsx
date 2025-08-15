import { useState } from "react";
import { Form } from "antd";

type FormInstance = ReturnType<typeof Form.useForm>[0];

interface FormState {
    forms: FormInstance[];
    errors: boolean[];
    setErrors: any;
    disabledStates: boolean[];
    setDisabledStates: any;
}

export const useFormState = (formCount: number): FormState => {
    const forms = Array.from({ length: formCount }, () => Form.useForm()[0]);

    const [errors, setErrors] = useState(Array(formCount).fill(false));
    const [disabledStates, setDisabledStates] = useState(Array(formCount).fill(false));


    const errorSetters = errors.map((_, index) => (state: boolean) => {
        setErrors((prev) => {
            const newErrors = [...prev];
            newErrors[index] = state;
            return newErrors;
        });
    });

    const disabledSetters = disabledStates.map((_, index) => (state: boolean) => {
        setDisabledStates((prev) => {
            const newDisabledStates = [...prev];
            newDisabledStates[index] = state;
            return newDisabledStates;
        });
    });

    return {
        forms,
        errors,
        setErrors: errorSetters,
        disabledStates,
        setDisabledStates: disabledSetters,
    };
};
