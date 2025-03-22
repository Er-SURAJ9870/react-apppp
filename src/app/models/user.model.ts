export interface User {
    _id: any,
    role?: string
    name: string,
    firstName: string,
    middleName?: string,
    lastName?: string,
    email: string,
    employeeType: string,
    dob: string
    imageUrl: string,
    createdAt?: Date,
    allowEmail?: boolean,
    allowNotification?: boolean,
    title?: string,
    startDate?: Date,
    lastDate?: Date,
    payType?: string,
    socialSecurity?: string,
    address: {
        address1?: string,
        address2?: string,
        state?: string,
        city?: string,
        zipcode?: string
    },
    countryCode?:string,
    mobileNumber?:string,
    payRate?: number,
}



