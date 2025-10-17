import React, { useCallback } from 'react';
import { Input } from '../atoms/Input';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/slices/filterSlice';

export const SearchBar = React.memo(() => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(state => state.filters.searchQuery);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch]
  );

  return (
    <div className="w-full max-w-md">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearch}
        aria-label="Search tasks"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
