import {LoaderCircle} from "lucide-react";

export default function Loading() {
    return (
        <section className="h-screen flex justify-center bg-black items-center">
            <div className="text-5xl text-white animate-spin">
                <LoaderCircle/>
            </div>
        </section>
    );
}
