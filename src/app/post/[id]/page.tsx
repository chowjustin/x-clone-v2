import PostDetailPage from "@/app/components/PostDetailPage";

import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Tweets",
    description: "Tweets",
};

export default function PostPage() {
    return <PostDetailPage/>;
}
