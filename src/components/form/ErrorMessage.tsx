import clsxm from "@/lib/clsxm";

export default function ErrorMessage({
  children,
  errorMessageClassName,
}: { children: string; errorMessageClassName?: string }) {
  return (
    <div className="flex space-x-1">
      <p
        className={clsxm(
          "text-xs !leading-tight text-red-500",
          errorMessageClassName,
        )}
      >
        {children}
      </p>
    </div>
  );
}
