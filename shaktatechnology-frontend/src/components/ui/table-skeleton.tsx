import React from "react";
import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    showImage?: boolean;
    showActions?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 5,
    columns = 5,
    showImage = false,
    showActions = true,
}) => {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-gray-100 dark:border-gray-700">
                    {showImage && (
                        <td className="py-3 px-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </td>
                    )}
                    {[...Array(columns)].map((_, j) => (
                        <td key={j} className="py-3 px-4">
                            <Skeleton className="h-4 w-full" />
                        </td>
                    ))}
                    {showActions && (
                        <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                                <Skeleton className="h-8 w-16 rounded" />
                                <Skeleton className="h-8 w-16 rounded" />
                            </div>
                        </td>
                    )}
                </tr>
            ))}
        </>
    );
};

export const TableEmptyState: React.FC<{ message: React.ReactNode; colSpan: number }> = ({ message, colSpan }) => (
    <tr>
        <td colSpan={colSpan} className="py-12 text-center text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center justify-center space-y-2">
                <div className="font-medium text-lg">{message}</div>
            </div>
        </td>
    </tr>
);
