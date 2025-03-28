'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Folder, ChevronRight, ChevronDown } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

const initialFiles: FileItem[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'app',
        type: 'folder',
        children: [
          { name: 'page.tsx', type: 'file' },
          { name: 'layout.tsx', type: 'file' },
        ],
      },
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Editor.tsx', type: 'file' },
          { name: 'Sidebar.tsx', type: 'file' },
          { name: 'TopBar.tsx', type: 'file' },
        ],
      },
    ],
  },
];

const FileItem = ({ item, level = 0 }: { item: FileItem; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {item.type === 'folder' && (
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        {item.type === 'folder' ? (
          <Folder size={16} className="text-[#c5c5c5]" />
        ) : (
          <FileText size={16} className="text-[#c5c5c5]" />
        )}
        <span className="text-sm">{item.name}</span>
      </div>
      {isOpen && item.children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {item.children.map((child, index) => (
            <FileItem key={index} item={child} level={level + 1} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-[#3c3c3c]">
        <h2 className="text-sm font-medium">EXPLORER</h2>
      </div>
      <div className="flex-1 overflow-auto">
        {initialFiles.map((item, index) => (
          <FileItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 