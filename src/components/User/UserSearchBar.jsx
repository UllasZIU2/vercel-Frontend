import { Search, Filter } from "lucide-react";

const UserSearchBar = ({
  searchTerm,
  onSearchChange,
  isFilterOpen,
  toggleFilters,
}) => {
  return (
    <div className="bg-base-200 border-base-300 border-b p-3">
      <div className="flex items-center justify-between">
        <div className="relative flex w-full items-center md:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered input-sm w-full pr-8"
            value={searchTerm}
            onChange={onSearchChange}
          />
          <Search
            className="absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-400"
            size={16}
          />
        </div>

        <button
          className="btn btn-sm btn-outline gap-2"
          onClick={toggleFilters}
        >
          <Filter size={16} />
          {isFilterOpen ? "Hide Filters" : "Filters"}
        </button>
      </div>
    </div>
  );
};

export default UserSearchBar;
