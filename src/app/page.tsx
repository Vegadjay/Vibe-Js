'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import Editor from '@/components/Editor';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <motion.div
          animate={{ width: isSidebarOpen ? '250px' : '0px' }}
          className="bg-[#252526] border-r border-[#3c3c3c] overflow-hidden"
        >
          <Sidebar />
        </motion.div>
        <div className="flex-1 flex flex-col">
          <Editor />
        </div>
      </div>
    </main>
  );
} 