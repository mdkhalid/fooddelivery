import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';
import { EmptyState, Pagination, Skeleton } from '@/components/ui';
import { History } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS';
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

interface PointsHistoryProps {
  history: Transaction[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

const typeIcons: Record<string, string> = {
  EARNED: '➕',
  REDEEMED: '🎁',
  EXPIRED: '⏰',
  BONUS: '⭐',
};

export default function PointsHistory({
  history,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: PointsHistoryProps) {
  if (isLoading) {
    return <HistorySkeleton />;
  }

  if (history.length === 0) {
    return (
      <EmptyState
        icon={<History className="h-8 w-8" />}
        title="No points history yet"
        description="Your points transactions will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
              <th className="pb-3 pl-4">Date</th>
              <th className="pb-3">Description</th>
              <th className="pb-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {history.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-surface-50 transition-colors">
                <td className="py-3 pl-4 text-sm text-surface-500">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{typeIcons[transaction.type]}</span>
                    <span className="text-sm text-surface-700">{transaction.description}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right">
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      transaction.points > 0 ? 'text-green-600' : 'text-red-500',
                    )}
                  >
                    {transaction.points > 0 ? '+' : ''}
                    {transaction.points.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
