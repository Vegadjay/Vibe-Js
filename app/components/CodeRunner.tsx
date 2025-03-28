'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import THEMES from './Themes';

interface CodeRunnerProps {
    code: string;
    theme?: keyof typeof THEMES;
}

const CodeRunner: React.FC<CodeRunnerProps> = ({
    code,
    theme = 'dark'
}) => {
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const currentTheme = THEMES[theme];

    const runCode = () => {
        setIsRunning(true);
        try {
            setOutput([]);
            setError(null);

            const logs: string[] = [];
            const customConsole = {
                log: (...args: any[]) => {
                    logs.push(args.map(arg =>
                        typeof arg === 'object'
                            ? JSON.stringify(arg, null, 2)
                            : String(arg)
                    ).join(' '));
                },
                warn: (...args: any[]) => {
                    logs.push(`⚠️ ${args.map(String).join(' ')}`);
                },
                error: (...args: any[]) => {
                    logs.push(`❌ ${args.map(String).join(' ')}`);
                }
            };

            const runUserCode = new Function('console', code);
            runUserCode(customConsole);

            setOutput(logs);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
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
                    <Button
                        variant="default"
                        size="sm"
                        onClick={runCode}
                        disabled={isRunning}
                        className="flex items-center"
                    >
                        {isRunning ? 'Running...' : 'Run'}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={clearOutput}
                        className="flex items-center"
                    >
                        Clear
                    </Button>
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
                    <div className="text-red-400">
                        <pre className="break-words whitespace-pre-wrap">
                            {error}
                        </pre>
                    </div>
                ) : output.length === 0 ? (
                    <div
                        className="text-gray-500 text-center py-4"
                        style={{ color: currentTheme.text }}
                    >
                        Run code to see output
                    </div>
                ) : (
                    output.map((line, index) => (
                        <div
                            key={index}
                            className="text-green-400 break-words"
                            style={{ color: currentTheme.syntaxColors.function }}
                        >
                            {line}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CodeRunner;