import {LucideIcon} from "lucide-react";

const MenuItem = ({icon: Icon, title, onClick}: { icon: LucideIcon, title: string, onClick?: () => void }) => (
    <div
        className="flex items-center p-3 px-5 rounded-full hover:bg-gray-900 cursor-pointer w-fit transition-colors"
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={title}
    >
        <Icon className="w-6 h-6"/>
        <span className="ml-4 text-xl max-xl:text-lg max-md:hidden">{title}</span>
    </div>
);

export default MenuItem;