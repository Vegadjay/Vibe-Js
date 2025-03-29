'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { nord } from '@uiw/codemirror-theme-nord';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { lineNumbers } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
import { Button } from '@/components/ui/button';
import THEMES from './Themes';
import { Scissors, ZoomIn, ZoomOut } from 'lucide-react';

interface CodeEditorProps {
    initialCode?: string;
    onCodeChange?: (code: string) => void;
    theme?: keyof typeof THEMES;
    fontFamily?: string;
    onKeyPress?: (key: string) => void;
    className?: string;
}

// Define types for editor instance
interface EditorInstance {
    view?: unknown;
    state?: unknown;
    container?: HTMLElement;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    initialCode = '// Write your JavaScript code here',
    onCodeChange,
    theme = 'dark',
    fontFamily = 'JetBrains Mono',
    onKeyPress,
    className = ''
}) => {
    const [code, setCode] = useState(initialCode);
    const fontSizeRef = useRef<number>(16);
    const [fontSize, setFontSize] = useState(16);
    const [isMobile, setIsMobile] = useState(false);
    const [showButtons, setShowButtons] = useState(true);
    const editorRef = useRef<HTMLDivElement>(null);
    const editorInstanceRef = useRef<EditorInstance | null>(null);

    const currentTheme = THEMES[theme];

    const codeMirrorTheme = useMemo(() => {
        switch (currentTheme.codeMirrorTheme) {
            case 'light': return vscodeLight;
            case 'dracula': return dracula;
            case 'nord': return nord;
            case 'monokai': return monokai;
            case 'solarized': return solarizedDark;
            default: return vscodeDark;
        }
    }, [currentTheme.codeMirrorTheme]);

    const cursorStyle = useMemo(() => [
        EditorView.theme({
            '.cm-cursor': {
                borderLeftWidth: '3px',
                borderLeftStyle: 'solid',
                borderLeftColor: currentTheme.cursorColor,
                opacity: '1 !important',
            },
            '.cm-cursor-primary': {
                borderLeftWidth: '3px',
                borderLeftColor: currentTheme.cursorColor,
            }
        })
    ], [currentTheme.cursorColor]);

    const editorExtensions = useMemo(() => [
        javascript({ jsx: true }),
        lineNumbers(),
        cursorStyle
    ], [cursorStyle]);

    const editorStyle = useMemo(() => ({
        fontSize: `${fontSize}px`,
        lineHeight: '1.6',
        backgroundColor: currentTheme.editorBackground,
        height: '100%',
        overflow: 'auto',
        fontFamily: `'${fontFamily}', monospace`
    } as React.CSSProperties), [fontSize, currentTheme.editorBackground, fontFamily]);

    useEffect(() => {
        const savedFontSize = localStorage.getItem('editor-font-size');
        if (savedFontSize) {
            const parsedSize = parseInt(savedFontSize, 10);
            setFontSize(parsedSize);
            fontSizeRef.current = parsedSize;
        }

        const checkMobile = () => {
            const width = window.innerWidth;
            const isMobileScreen = width <= 768;
            setIsMobile(isMobileScreen);

            // On very small screens, hide buttons
            setShowButtons(width > 375);

            if (!savedFontSize) {
                const defaultSize = isMobileScreen ? 14 : 16;
                setFontSize(defaultSize);
                fontSizeRef.current = defaultSize;
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleEditorKeyPress = (event: KeyboardEvent) => {
            if (onKeyPress) {
                if (event.key.length > 1) {
                    onKeyPress(event.key);
                } else {
                    onKeyPress(event.key);
                }
            }
        };

        // Store reference to current editor element
        const currentEditorRef = editorRef.current;

        if (currentEditorRef) {
            currentEditorRef.addEventListener('keydown', handleEditorKeyPress);
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            if (currentEditorRef) {
                currentEditorRef.removeEventListener('keydown', handleEditorKeyPress);
            }
        };
    }, [onKeyPress]);

    const handleCodeChange = (value: string) => {
        setCode(value);
        onCodeChange?.(value);
    };

    const updateFontSize = (newSize: number) => {
        setFontSize(newSize);
        fontSizeRef.current = newSize;
        localStorage.setItem('editor-font-size', newSize.toString());
    };

    const zoomIn = () => {
        const newSize = Math.min(fontSizeRef.current + 2, isMobile ? 32 : 40);
        updateFontSize(newSize);
    };

    const zoomOut = () => {
        const newSize = Math.max(fontSizeRef.current - 2, isMobile ? 10 : 12);
        updateFontSize(newSize);
    };

    const formatCode = () => {
        try {
            const formatted = code
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n');
            setCode(formatted);
            onCodeChange?.(formatted);
        } catch (err) {
            console.error('Formatting failed:', err);
        }
    };

    const editorCreateRef = (editor: EditorInstance | null) => {
        if (editor) {
            editorInstanceRef.current = editor;
        }
    };

    const wordCount = code.split(/\s+/).filter(Boolean).length;
    const charCount = code.length;

    return (
        <motion.div
            ref={editorRef}
            className={`relative w-full h-full flex flex-col ${className}`}
            style={{
                backgroundColor: currentTheme.editorBackground,
                color: currentTheme.text
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center p-2 sm:p-3 border-b border-gray-700 gap-2"
                style={{ backgroundColor: currentTheme.editorBackground }}
            >
                <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-center sm:justify-start">
                    <motion.div
                        className="text-xs sm:text-sm text-gray-400 mr-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        Font: {fontSize}px
                    </motion.div>
                    {showButtons && (
                        <>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size={isMobile ? "sm" : "icon"}
                                    onClick={zoomOut}
                                    title="Zoom Out"
                                    className="hover:bg-gray-700 rounded-full transition-all duration-300"
                                >
                                    {isMobile ? "-" : <ZoomOut size={isMobile ? 14 : 16} />}
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size={isMobile ? "sm" : "icon"}
                                    onClick={zoomIn}
                                    title="Zoom In"
                                    className="hover:bg-gray-700 rounded-full transition-all duration-300"
                                >
                                    {isMobile ? "+" : <ZoomIn size={isMobile ? 14 : 16} />}
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size={isMobile ? "sm" : "icon"}
                                    onClick={formatCode}
                                    title="Format Code"
                                    className="hover:bg-gray-700 rounded-full transition-all duration-300"
                                >
                                    <Scissors size={isMobile ? 14 : 16} />
                                </Button>
                            </motion.div>
                        </>
                    )}
                </div>
                <motion.div
                    className="text-xs sm:text-sm text-gray-400 w-full sm:w-auto text-center sm:text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    Words: {wordCount} | Chars: {charCount}
                </motion.div>
            </div>

            <div className="flex-grow overflow-auto">
                <CodeMirror
                    value={code}
                    height="100%"
                    theme={codeMirrorTheme}
                    extensions={editorExtensions}
                    onChange={handleCodeChange}
                    style={editorStyle}
                    data-custom-styles={{
                        '--keyword-color': currentTheme.syntaxColors.keyword,
                        '--string-color': currentTheme.syntaxColors.string,
                        '--function-color': currentTheme.syntaxColors.function,
                        '--comment-color': currentTheme.syntaxColors.comment
                    }}
                    ref={editorCreateRef}
                />
            </div>
        </motion.div>
    );
};

export default CodeEditor;