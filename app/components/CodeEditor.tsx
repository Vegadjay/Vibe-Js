'use client';
import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { nord } from '@uiw/codemirror-theme-nord';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { solarizedDark, solarizedLight } from '@uiw/codemirror-theme-solarized';
import { lineNumbers } from '@codemirror/view';
import { Button } from '@/components/ui/button';
import THEMES from './Themes';

interface CodeEditorProps {
    initialCode?: string;
    onCodeChange?: (code: string) => void;
    theme?: keyof typeof THEMES;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    initialCode = '// Write your JavaScript code here',
    onCodeChange,
    theme = 'dark'
}) => {
    const [code, setCode] = useState(initialCode);
    const [fontSize, setFontSize] = useState(16);
    const [isMobile, setIsMobile] = useState(false);

    const currentTheme = THEMES[theme];

    // Map CodeMirror themes dynamically
    const getCodeMirrorTheme = () => {
        switch (currentTheme.codeMirrorTheme) {
            case 'light': return vscodeLight;
            case 'dracula': return dracula;
            case 'nord': return nord;
            case 'monokai': return monokai;
            case 'solarized': return solarizedDark;
            default: return vscodeDark;
        }
    };

    useEffect(() => {
        const checkMobile = () => {
            const isMobileScreen = window.innerWidth <= 768;
            setIsMobile(isMobileScreen);
            setFontSize(isMobileScreen ? 14 : 16);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleCodeChange = (value: string) => {
        setCode(value);
        onCodeChange?.(value);
    };

    const zoomIn = () => {
        setFontSize(prevSize => {
            if (isMobile) {
                return Math.min(prevSize + 2, 32);
            }
            return Math.min(prevSize + 2, 40);
        });
    };

    const zoomOut = () => {
        setFontSize(prevSize => {
            if (isMobile) {
                return Math.max(prevSize - 2, 10);
            }
            return Math.max(prevSize - 2, 12);
        });
    };

    return (
        <div
            className="relative w-full h-full flex flex-col"
            style={{
                backgroundColor: currentTheme.editorBackground,
                color: currentTheme.text
            }}
        >
            <div
                className="sticky top-0 z-50 flex justify-between items-center p-2 sm:p-3 border-b border-gray-700"
                style={{ backgroundColor: currentTheme.editorBackground }}
            >
                <div className="flex items-center space-x-2">
                    <div className="text-xs sm:text-sm text-gray-400 mr-2">
                        Font: {fontSize}px
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={zoomOut}
                        title="Zoom Out"
                    >
                        -
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={zoomIn}
                        title="Zoom In"
                    >
                        +
                    </Button>
                </div>
            </div>

            <div className="flex-grow overflow-auto">
                <CodeMirror
                    value={code}
                    height="100%"
                    theme={getCodeMirrorTheme()}
                    extensions={[
                        javascript({ jsx: true }),
                        lineNumbers()
                    ]}
                    onChange={handleCodeChange}
                    style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: '1.6',
                        backgroundColor: currentTheme.editorBackground,
                        height: '100%',
                        overflow: 'auto',
                    } as React.CSSProperties}
                    data-custom-styles={{
                        '--keyword-color': currentTheme.syntaxColors.keyword,
                        '--string-color': currentTheme.syntaxColors.string,
                        '--function-color': currentTheme.syntaxColors.function,
                        '--comment-color': currentTheme.syntaxColors.comment
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;