import RegisterUser from "@/app/(auth)/register/containers/RegisterForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Register",
    description: "Register to X",
};

export default function RegisterPage() {
    return <RegisterUser/>;
}
