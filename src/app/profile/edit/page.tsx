import EditProfile from "@/app/profile/edit/containers/EditProfile";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Edit Profile",
    description: "Edit your profile",
};

export default function EditProfilePage() {
    return <EditProfile/>;
}
