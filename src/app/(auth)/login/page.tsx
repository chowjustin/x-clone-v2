import LoginUser from "@/app/(auth)/login/containers/LoginForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to X",
};

export default function LoginPage() {
    return <LoginUser/>;
}
