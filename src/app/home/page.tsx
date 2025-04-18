import Home from "@/app/home/containers/HomePage";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "Home page of X",
};

export default function HomePage() {
    return <Home/>;
}
