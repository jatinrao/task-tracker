import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { useAppSelector } from '../../store/hooks';
import { selectFilteredTasks } from '../../store/selectors';
import { format, parseISO } from 'date-fns';

type SortField = 'title' | 'category' | 'status' | 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export const TaskTable = React.memo(() => {
  const tasks = useAppSelector(selectFilteredTasks);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        // Toggle direction if clicking same field
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        // New field, start with ascending
        setSortField(field);
        setSortDirection('asc');
      }
      setCurrentPage(1);
    },
    [sortField]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const searchedTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => task.title.toLowerCase().includes(query));
  }, [tasks, searchQuery]);

  const sortedTasks = useMemo(() => {
    const sorted = [...searchedTasks].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [searchedTasks, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTasks.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTasks, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-400">↕</span>;
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (tasks.length === 0) {
    return (
      <Card title="Tasks">
        <div className="text-center py-8 text-gray-500">No tasks found</div>
      </Card>
    );
  }

  return (
    <Card title={`Tasks (${searchedTasks.length} of ${tasks.length})`} className='relative' >
     
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search tasks"
          className="max-w-sm h-8 absolute right-4 top-4"
        />
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                Title <SortIcon field="title" />
              </th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                Category <SortIcon field="category" />
              </th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon field="status" />
              </th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                Date <SortIcon field="date" />
              </th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                Amount <SortIcon field="amount" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map(task => (
              <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{task.title}</td>
                <td className="px-4 py-3">
                  <Badge type="category" value={task.category} />
                </td>
                <td className="px-4 py-3">
                  <Badge type="status" value={task.status} />
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {format(parseISO(task.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-4 py-3 text-gray-700">${task.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
});

TaskTable.displayName = 'TaskTable';
