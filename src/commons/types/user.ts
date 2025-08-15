
export interface User {
    id: number;
    email: string;
    user_name: string;
    employee_id?: string;
    phone_number?: string;
    country_code?: string;
    company_name: string;
    geographic_location: string;
    created_at?: string;
    last_modified_at?: string;
}
