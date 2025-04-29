import React, { useState } from 'react';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            alert(`Searching for: ${searchTerm}`);
        }
    };

    return (
        <div className="flex items-center rounded-md border border-gray-300 focus-within:border-blue-500 shadow-sm">
            <input
                type="text"
                placeholder="Search..."
                className="block w-full rounded-md border-0 p-2 text-gray-900 focus:ring-0 sm:text-sm"
                value={searchTerm}
                onChange={handleInputChange}
            />
            <button
                type="button"
                className="pr-2 text-gray-400 hover:text-gray-500"
                onClick={handleSearch}
            >
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
}

export default SearchBar;