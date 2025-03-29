'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Trash2 } from 'lucide-react';
import THEMES from './Themes';

interface CodeRunnerProps {
    code: string;
    theme?: keyof typeof THEMES;
    onRun?: () => void;
    onError?: () => void;
    onSuccess?: () => void;
    className?: string;
}

// Define proper types for console arguments
type ConsoleArgument = string | number | boolean | object | null | undefined;

const CodeRunner: React.FC<CodeRunnerProps> = ({
    code,
    theme = 'dark',
    onRun,
    onError,
    onSuccess,
    className = ''
}) => {
    const [output, setOutput] = useState<{ text: string; timestamp: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const currentTheme = THEMES[theme];

    // Check device size on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const runCode = () => {
        setIsRunning(true);
        onRun?.();

        try {
            setOutput([]);
            setError(null);

            const logs: { text: string; timestamp: string }[] = [];
            const customConsole = {
                log: (...args: ConsoleArgument[]) => {
                    logs.push({
                        text: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '),
                        timestamp: new Date().toLocaleTimeString()
                    });
                },
                warn: (...args: ConsoleArgument[]) => {
                    logs.push({
                        text: `⚠️ ${args.map(String).join(' ')}`,
                        timestamp: new Date().toLocaleTimeString()
                    });
                },
                error: (...args: ConsoleArgument[]) => {
                    logs.push({
                        text: `❌ ${args.map(String).join(' ')}`,
                        timestamp: new Date().toLocaleTimeString()
                    });
                }
            };

            const runUserCode = new Function('console', code);
            runUserCode(customConsole);

            setOutput(logs);
            onSuccess?.();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            onError?.();
        } finally {
            setIsRunning(false);
        }
    };

    const clearOutput = () => {
        setOutput([]);
        setError(null);
    };

    return (
        <div
            className={`h-full flex flex-col ${className}`}
            style={{
                backgroundColor: currentTheme.editorBackground,
                color: currentTheme.text
            }}
        >
            <div
                className="sticky top-0 z-10 p-2 sm:p-3 md:p-4 border-b border-gray-700 flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0"
                style={{
                    backgroundColor: currentTheme.editorBackground,
                    color: currentTheme.text
                }}
            >
                <h2
                    className="text-sm md:text-base lg:text-lg font-semibold w-full sm:w-auto text-center sm:text-left mb-1 sm:mb-0"
                    style={{ color: currentTheme.text }}
                >
                    Console Output
                </h2>
                <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="default"
                            size={isMobile ? "sm" : "default"}
                            onClick={runCode}
                            disabled={isRunning}
                            className="flex items-center gap-1 transition-all duration-300 hover:bg-opacity-80"
                            style={{ backgroundColor: currentTheme.accent }}
                        >
                            <Play size={isMobile ? 14 : 16} />
                            <span>{isRunning ? 'Running...' : 'Run'}</span>
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="destructive"
                            size={isMobile ? "sm" : "default"}
                            onClick={clearOutput}
                            className="flex items-center gap-1 transition-all duration-300 hover:bg-opacity-80"
                        >
                            <Trash2 size={isMobile ? 14 : 16} />
                            <span className={isMobile ? "hidden" : "inline"}>Clear</span>
                        </Button>
                    </motion.div>
                </div>
            </div>

            <div
                className="flex-grow overflow-auto p-2 sm:p-3 md:p-4 text-xs sm:text-sm"
                style={{
                    backgroundColor: currentTheme.editorBackground,
                    color: currentTheme.text
                }}
            >
                {error ? (
                    <motion.div
                        className="text-red-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <pre className="break-words whitespace-pre-wrap text-xs sm:text-sm">
                            {error}
                        </pre>
                    </motion.div>
                ) : output.length === 0 ? (
                    <motion.div
                        className="text-gray-500 text-center py-4 text-xs sm:text-sm"
                        style={{ color: currentTheme.text }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        Run code to see output
                    </motion.div>
                ) : (
                    output.map((line, index) => (
                        <motion.div
                            key={index}
                            className="break-words flex flex-col sm:flex-row sm:justify-between mb-1 sm:mb-0.5"
                            style={{ color: currentTheme.syntaxColors.function }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <span className="text-xs sm:text-sm break-words">{line.text}</span>
                            <span className="text-gray-500 text-xs mt-0.5 sm:mt-0 sm:ml-2 sm:shrink-0">{line.timestamp}</span>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CodeRunner;