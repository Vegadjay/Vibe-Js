'use client';

import { Menu, Search, SourceControl, Extensions, Debug, Settings } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="h-12 bg-[#333333] border-b border-[#3c3c3c] flex items-center px-4">
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-[#3c3c3c] rounded">
          <Menu size={16} />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#cccccc]">File</span>
          <span className="text-[#cccccc]">Edit</span>
          <span className="text-[#cccccc]">Selection</span>
          <span className="text-[#cccccc]">View</span>
          <span className="text-[#cccccc]">Go</span>
          <span className="text-[#cccccc]">Run</span>
          <span className="text-[#cccccc]">Terminal</span>
          <span className="text-[#cccccc]">Help</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-96 bg-[#3c3c3c] rounded-md flex items-center px-2 py-1">
          <Search size={14} className="text-[#cccccc]" />
          <input
            type="text"
            placeholder="Search (Ctrl+Shift+F)"
            className="bg-transparent border-none outline-none text-sm text-[#cccccc] w-full ml-2"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-[#3c3c3c] rounded">
          <SourceControl size={16} />
        </button>
        <button className="p-1 hover:bg-[#3c3c3c] rounded">
          <Extensions size={16} />
        </button>
        <button className="p-1 hover:bg-[#3c3c3c] rounded">
          <Debug size={16} />
        </button>
        <button className="p-1 hover:bg-[#3c3c3c] rounded">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopBar; 