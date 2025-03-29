'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import THEMES from './Themes';

interface CodeRunnerProps {
    code: string;
    theme?: keyof typeof THEMES;
    onRun?: () => void;
    onError?: () => void;
    onSuccess?: () => void;
}

// Define proper types for console arguments
type ConsoleArgument = string | number | boolean | object | null | undefined;

const CodeRunner: React.FC<CodeRunnerProps> = ({
    code,
    theme = 'dark',
    onRun,
    onError,
    onSuccess
}) => {
    const [output, setOutput] = useState<{ text: string; timestamp: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const currentTheme = THEMES[theme];

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
            className="h-full flex flex-col"
            style={{
                backgroundColor: currentTheme.editorBackground,
                color: currentTheme.text
            }}
        >
            <div
                className="sticky top-0 z-10 p-2 sm:p-4 border-b border-gray-700 flex flex-wrap justify-between items-center space-y-2 sm:space-y-0"
                style={{
                    backgroundColor: currentTheme.editorBackground,
                    color: currentTheme.text
                }}
            >
                <h2
                    className="text-base sm:text-lg font-semibold w-full sm:w-auto text-center sm:text-left"
                    style={{ color: currentTheme.text }}
                >
                    Console Output
                </h2>
                <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={runCode}
                            disabled={isRunning}
                            className="flex items-center transition-all duration-300 hover:bg-opacity-80"
                            style={{ backgroundColor: currentTheme.accent }}
                        >
                            {isRunning ? 'Running...' : 'Run'}
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={clearOutput}
                            className="flex items-center transition-all duration-300 hover:bg-opacity-80"
                        >
                            Clear
                        </Button>
                    </motion.div>
                </div>
            </div>

            <div
                className="flex-grow overflow-auto p-2 sm:p-4 text-xs sm:text-sm"
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
                        <pre className="break-words whitespace-pre-wrap">
                            {error}
                        </pre>
                    </motion.div>
                ) : output.length === 0 ? (
                    <motion.div
                        className="text-gray-500 text-center py-4"
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
                            className="text-green-400 break-words flex justify-between"
                            style={{ color: currentTheme.syntaxColors.function }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <span>{line.text}</span>
                            <span className="text-gray-500 text-xs">{line.timestamp}</span>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CodeRunner;