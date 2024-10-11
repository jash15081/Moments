import React from "react";

function Search() {
  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-12 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Placeholder for search results */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Search Results:</h2>
        <div className="bg-white shadow-md rounded-md p-4">
          {/* Example search result items */}
          <div className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
            <img
              src="media/icons/example_icon.svg"
              alt="Result Icon"
              className="h-6 mr-2"
            />
            <span>Example Result 1</span>
          </div>
          <div className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
            <img
              src="media/icons/example_icon.svg"
              alt="Result Icon"
              className="h-6 mr-2"
            />
            <span>Example Result 2</span>
          </div>
          <div className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
            <img
              src="media/icons/example_icon.svg"
              alt="Result Icon"
              className="h-6 mr-2"
            />
            <span>Example Result 3</span>
          </div>
          {/* Add more results as needed */}
        </div>
      </div>
    </div>
  );
}

export default Search;
