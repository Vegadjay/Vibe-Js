'use client';
import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
    FileCode,
    Save,
    Download,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import THEMES from './Themes';

// Dynamic Imports
const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false });
const CodeRunner = dynamic(() => import('./CodeRunner'), { ssr: false });

const DEFAULT_CODE = `// JavaScript Fundamentals

// 1. Variables and Data Types
let name = "John Doe";
const age = 30;
let isStudent = false;

// 2. Advanced Function
const calculateBMI = (weight, height) => {
    const bmi = weight / (height * height);
    console.log("BMI Calculation:");
    console.log(\`Weight: \${weight} kg\`);
    console.log(\`Height: \${height} m\`);
    console.log(\`BMI: \${bmi.toFixed(2)}\`);
    return bmi;
};

// Example Usage
calculateBMI(70, 1.75);

// 3. Array Manipulation
const numbers = [1, 2, 3, 4, 5];
const squaredNumbers = numbers.map(num => num * num);
console.log("Squared Numbers:", squaredNumbers);
`;

const WebEditorPage: React.FC = () => {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [currentTheme, setCurrentTheme] = useState<keyof typeof THEMES>('dark');

    const saveCodeToLocalStorage = useCallback(() => {
        try {
            localStorage.setItem('savedCode', code);
            alert('Code saved successfully!');
        } catch (error) {
            console.error('Failed to save code', error);
        }
    }, [code]);

    const downloadCode = useCallback(() => {
        const blob = new Blob([code], { type: 'text/javascript' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'code_export.js';
        link.click();
    }, [code]);

    const cycleTheme = () => {
        const themeKeys = Object.keys(THEMES) as Array<keyof typeof THEMES>;
        const currentIndex = themeKeys.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setCurrentTheme(themeKeys[nextIndex]);
    };

    const resetCode = () => {
        setCode(DEFAULT_CODE);
    };

    const activeTheme = THEMES[currentTheme];

    return (
        <div
            className="h-screen flex flex-col overflow-hidden"
            style={{
                backgroundColor: activeTheme.background,
                color: activeTheme.text
            }}
        >
            <header
                className="flex justify-between items-center sticky top-0 z-10 p-2 sm:p-4 border-b border-gray-700"
                style={{ backgroundColor: activeTheme.editorBackground }}
            >
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <FileCode className="w-6 h-6 sm:w-8 sm:h-8" color={activeTheme.accent} />
                    <h1 className="text-lg sm:text-2xl font-bold">JS Learning Editor</h1>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={cycleTheme}
                        className="mr-2"
                    >
                        {activeTheme.name}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetCode}
                        title="Reset Code"
                    >
                        <RotateCcw size={16} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={saveCodeToLocalStorage}
                        title="Save Code"
                    >
                        <Save size={16} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={downloadCode}
                        title="Download Code"
                    >
                        <Download size={16} />
                    </Button>
                </div>
            </header>

            <div className="flex-grow overflow-hidden flex">
                <div className="w-1/2 h-full">
                    <CodeEditor
                        initialCode={code}
                        onCodeChange={(newCode) => setCode(newCode)}
                        theme={currentTheme}
                    />
                </div>
                <div className="w-1/2 h-full border-l border-gray-700">
                    <CodeRunner
                        code={code}
                        theme={currentTheme}
                    />
                </div>
            </div>
        </div>
    );
};

export default WebEditorPage;
