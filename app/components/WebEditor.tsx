'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
    FileCode,
    Save,
    Download,
    RotateCcw,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
    Palette // New icon for theme switching
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import THEMES from './Themes';

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

const CHERRY_MX_BROWN_CONFIG = {
    "id": "custom-sound-pack-1582656695035",
    "name": "CherryMX Brown - ABS keycaps",
    "key_define_type": "single",
    "includes_numpad": false,
    "defines": {
        "1": [1402, 170],
        "2": [8760, 173],
        "3": [9149, 167],
        "4": [9550, 165],
        "5": [9942, 150],
        "6": [10370, 145],
        "7": [10791, 140],
        "8": [11205, 150],
        "9": [11603, 136],
        "10": [12012, 148],
        "11": [12440, 140],
        "12": [12844, 131],
        "13": [13231, 132],
        "14": [13667, 134],
        "15": [15286, 161],
        "16": [15665, 180],
        "17": [16052, 171],
        "18": [16411, 174],
        "19": [16772, 158],
        "20": [17124, 178],
        "21": [17478, 142],
        "22": [17843, 146],
        "23": [18212, 139],
        "24": [18611, 148],
        "25": [19036, 134],
        "26": [19440, 127],
        "27": [19854, 192],
        "28": [26548, 119],
        "29": [32761, 168],
        "30": [22324, 167],
        "31": [22698, 167],
        "32": [23072, 163],
        "33": [23408, 178],
        "34": [23770, 183],
        "35": [24140, 145],
        "36": [24525, 154],
        "37": [24919, 138],
        "38": [25314, 142],
        "39": [25711, 129],
        "40": [26121, 123],
        "41": [8365, 166],
        "42": [27208, 158],
        "43": [20262, 143],
        "44": [27589, 164],
        "45": [27978, 160],
        "46": [28321, 160],
        "47": [28694, 162],
        "48": [29071, 152],
        "49": [29485, 159],
        "50": [29873, 137],
        "51": [30269, 139],
        "52": [30664, 132],
        "53": [31026, 138],
        "54": [31455, 139],
        "55": [7874, 148],
        "56": [33530, 170],
        "57": [37338, 200],
        "58": [21920, 176],
        "59": [1852, 162],
        "60": [2275, 155],
        "61": [2668, 167],
        "62": [3054, 162],
        "63": [3467, 161],
        "64": [3877, 151],
        "65": [4501, 120],
        "66": [4951, 141],
        "67": [5381, 133],
        "68": [5779, 145],
        "69": [7023, 161],
        "70": [7448, 142],
        "71": [14084, 125],
        "72": [14500, 142],
        "73": [14877, 146],
        "74": [12844, 131],
        "75": [20713, 139],
        "76": [21121, 151],
        "77": [21527, 142],
        "78": [13667, 134],
        "79": [35966, 143],
        "80": [36356, 147],
        "81": [36787, 170],
        "82": [31455, 139],
        "83": [32054, 167],
        "87": [6207, 139],
        "88": [6637, 127],
        "3612": [26548, 119],
        "3613": [35572, 139],
        "3637": [7448, 142],
        "3639": [7023, 161],
        "3640": [34354, 157],
        "3653": [7874, 148],
        "3655": [14500, 142],
        "3657": [14877, 146],
        "3663": [21121, 151],
        "3665": [21527, 142],
        "3666": [14084, 125],
        "3667": [20713, 139],
        "3675": [33157, 170],
        "3676": [34762, 147],
        "3677": [35572, 139],
        "57416": [32054, 167],
        "57419": [35966, 143],
        "57421": [36787, 170],
        "57424": [36356, 147],
        "60999": [14500, 142],
        "61000": [32054, 167],
        "61001": [14877, 146],
        "61003": [35966, 143],
        "61005": [36787, 170],
        "61007": [21121, 151],
        "61008": [36356, 147],
        "61009": [21527, 142],
        "61010": [14084, 125],
        "61011": [20713, 139]
    }
};

const KEY_MAPPING = {
    'a': '30', 'b': '48', 'c': '46', 'd': '32', 'e': '18', 'f': '33', 'g': '34',
    'h': '35', 'i': '24', 'j': '36', 'k': '37', 'l': '38', 'm': '50', 'n': '49',
    'o': '25', 'p': '26', 'q': '16', 'r': '19', 's': '31', 't': '20', 'u': '23',
    'v': '47', 'w': '17', 'x': '45', 'y': '22', 'z': '44', '0': '11', '1': '2',
    '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8', '8': '9', '9': '10',
    ' ': '57', 'Enter': '58', 'Backspace': '14', 'Tab': '15', 'Shift': '42',
    'Control': '29', 'Alt': '56', 'Escape': '1', '.': '51', ',': '39', ';': '39',
    "'": '40', '[': '26', ']': '27', '\\': '43', '/': '52', '-': '12', '=': '13',
    'default': '30'
};

const SOUND_EFFECTS = {
    run: ['15286', 161],
    clear: ['9942', 150],
    save: ['2668', 167],
    theme: ['10370', 145],
    error: ['33530', 170],
    success: ['16052', 171],
    keypress: ['2275', 155],
    default: ['1402', 170]
};

let audioContext: AudioContext | null = null;
let soundBuffer: AudioBuffer | null = null;

interface Font {
    name: string;
    path: string;
    family: string;
}

const AVAILABLE_FONTS: Font[] = [
    { name: 'JetBrainsMono', path: '/fonts/JetBrainsMono-Regular.woff2', family: 'JetBrains Mono' },
    { name: 'FiraCode', path: '/fonts/FiraCode-Regular.woff2', family: 'Fira Code' },
    { name: 'SourceCodePro', path: '/fonts/SourceCodePro-Regular.woff2', family: 'Source Code Pro' },
    { name: 'UbuntuMono', path: '/fonts/UbuntuMono-Regular.woff2', family: 'Ubuntu Mono' },
    { name: 'RobotoMono', path: '/fonts/RobotoMono-Regular.woff2', family: 'Roboto Mono' },
    { name: 'Inconsolata', path: '/fonts/Inconsolata-Regular.woff2', family: 'Inconsolata' }
];

const WebEditorPage = () => {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [currentTheme, setCurrentTheme] = useState('dark');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [currentFont, setCurrentFont] = useState(AVAILABLE_FONTS[0]);
    const [lastKeyPressed, setLastKeyPressed] = useState('');
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const soundEnabledRef = useRef(soundEnabled);

    // List of theme keys for cycling
    const themeKeys = Object.keys(THEMES);

    useEffect(() => {
        soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    useEffect(() => {
        const autoSave = setInterval(() => {
            localStorage.setItem('savedCode', code);
        }, 30000);
        return () => clearInterval(autoSave);
    }, [code]);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Promise.all(
                    AVAILABLE_FONTS.map(async (font) => {
                        const fontFace = new FontFace(
                            font.family,
                            `url(${font.path}) format('woff2')`,
                            { style: 'normal', weight: 'normal' }
                        );
                        await fontFace.load();
                        document.fonts.add(fontFace);
                    })
                );
                setFontsLoaded(true);
            } catch (error) {
                console.log('Failed to load fonts:', error);
            }
        };

        loadFonts();

        const savedFont = localStorage.getItem('editor-font');
        if (savedFont) {
            const foundFont = AVAILABLE_FONTS.find(font => font.name === savedFont);
            if (foundFont) setCurrentFont(foundFont);
        }

        const savedSoundEnabled = localStorage.getItem('sound-enabled');
        if (savedSoundEnabled !== null) {
            const isEnabled = savedSoundEnabled === 'true';
            setSoundEnabled(isEnabled);
            soundEnabledRef.current = isEnabled;
        }

        const savedCode = localStorage.getItem('savedCode');
        if (savedCode) setCode(savedCode);

        const initAudio = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const response = await fetch('/static/sound/brown_cherry/sound.ogg');
                const arrayBuffer = await response.arrayBuffer();
                soundBuffer = await audioContext.decodeAudioData(arrayBuffer);
                console.log('Cherry MX Brown sound pack loaded successfully');
            } catch (error) {
                console.error('Failed to load sound pack:', error);
            }
        };
        initAudio();

        return () => {
            if (audioContext) audioContext.close().catch(err => console.error("Error closing audio context:", err));
        };
    }, []);

    const playCherry = useCallback((startTime: number, duration: number) => {
        if (!soundEnabledRef.current || !audioContext || !soundBuffer) return;
        try {
            const source = audioContext.createBufferSource();
            source.buffer = soundBuffer;
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.7;
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            const startSeconds = startTime / 1000;
            const durationSeconds = duration / 1000;
            source.start(0, startSeconds, durationSeconds);
        } catch (err) {
            console.error("Error playing Cherry MX Brown sound:", err);
        }
    }, []);

    const playSound = useCallback((soundName: keyof typeof SOUND_EFFECTS) => {
        if (!soundEnabledRef.current || !soundBuffer) return;
        try {
            const [startTime, duration] = SOUND_EFFECTS[soundName] || SOUND_EFFECTS.default;
            playCherry(Number(startTime), Number(duration));
        } catch (err) {
            console.error("Error playing sound effect:", err);
        }
    }, [playCherry]);

    const playKeySound = useCallback((key: string) => {
        if (!soundEnabledRef.current || !soundBuffer) return;
        try {
            const normalizedKey = typeof key === 'string' && key.length === 1 ? key.toLowerCase() : key;
            const keyIndex = KEY_MAPPING[normalizedKey as keyof typeof KEY_MAPPING] || KEY_MAPPING.default;
            const soundData = CHERRY_MX_BROWN_CONFIG.defines[keyIndex as keyof typeof CHERRY_MX_BROWN_CONFIG.defines];
            if (soundData) {
                const [startTime, duration] = soundData;
                playCherry(startTime, duration);
            }
            setLastKeyPressed(normalizedKey);
        } catch (err) {
            console.error("Error playing key sound:", err);
        }
    }, [playCherry]);

    const saveCodeToLocalStorage = useCallback(() => {
        try {
            localStorage.setItem('savedCode', code);
            playSound('save');
            alert('Code saved successfully!');
        } catch (error) {
            console.error('Failed to save code', error);
            playSound('error');
        }
    }, [code, playSound]);

    const downloadCode = useCallback(() => {
        const blob = new Blob([code], { type: 'text/javascript' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'code_export.js';
        playSound('save');
        link.click();
    }, [code, playSound]);

    const cycleTheme = useCallback(() => {
        const currentIndex = themeKeys.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        const newTheme = themeKeys[nextIndex];
        setCurrentTheme(newTheme);
        playSound('theme');
    }, [currentTheme, playSound, themeKeys]);

    const resetCode = useCallback(() => {
        setCode(DEFAULT_CODE);
        playSound('clear');
    }, [playSound]);

    const toggleSound = useCallback(() => {
        const newSoundEnabled = !soundEnabled;
        setSoundEnabled(newSoundEnabled);
        soundEnabledRef.current = newSoundEnabled;
        localStorage.setItem('sound-enabled', newSoundEnabled.toString());
    }, [soundEnabled]);

    const changeFont = useCallback((font: Font) => {
        setCurrentFont(font);
        localStorage.setItem('editor-font', font.name);
        playSound('keypress');
    }, [playSound]);

    const runCode = useCallback(() => {
        playSound('run');
    }, [playSound]);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(!isFullscreen);
        playSound('theme');
    }, [isFullscreen, playSound]);

    const handleCodeChange = useCallback((newCode: string) => {
        if (newCode.length > code.length) {
            const addedChar = newCode.charAt(code.length);
            playKeySound(addedChar);
        } else if (newCode.length < code.length) {
            playKeySound('Backspace');
        }
        setCode(newCode);
    }, [code, playKeySound]);

    const activeTheme = THEMES[currentTheme];

    return (
        <motion.div
            className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'}`}
            style={{
                backgroundColor: activeTheme.background,
                color: activeTheme.text
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={currentTheme} // Key to trigger re-render for theme transition
        >
            <motion.header
                className="flex justify-between items-center sticky top-0 z-10 p-2 sm:p-4 border-b border-gray-700"
                style={{ backgroundColor: activeTheme.editorBackground }}
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <FileCode className="w-6 h-6 sm:w-8 sm:h-8" color={activeTheme.accent} />
                    </motion.div>
                    <h1 className="text-lg sm:text-2xl font-bold">Learning With Vibe</h1>
                    {soundEnabled && (
                        <motion.span
                            className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Cherry MX Brown
                        </motion.span>
                    )}
                    {soundEnabled && lastKeyPressed && (
                        <motion.small
                            className="text-xs text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Last key: {lastKeyPressed}
                        </motion.small>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {/* Theme Switcher Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={cycleTheme}
                            className="mr-2 transition-all duration-300 hover:bg-opacity-80 flex items-center gap-2"
                            style={{
                                backgroundColor: activeTheme.accent,
                                color: activeTheme.text,
                                border: `1px solid ${activeTheme.accent}`
                            }}
                        >
                            <Palette size={16} />
                            {activeTheme.name}
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSound}
                            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
                            className="hover:bg-gray-700 rounded-full transition-all duration-300"
                        >
                            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetCode}
                            title="Reset Code"
                            className="hover:bg-gray-700 rounded-full transition-all duration-300"
                        >
                            <RotateCcw size={16} />
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={saveCodeToLocalStorage}
                            title="Save Code"
                            className="hover:bg-gray-700 rounded-full transition-all duration-300"
                        >
                            <Save size={16} />
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={downloadCode}
                            title="Download Code"
                            className="hover:bg-gray-700 rounded-full transition-all duration-300"
                        >
                            <Download size={16} />
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleFullscreen}
                            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                            className="hover:bg-gray-700 rounded-full transition-all duration-300"
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </Button>
                    </motion.div>
                </div>
            </motion.header>

            <motion.div
                className="flex-grow overflow-hidden flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className={isFullscreen ? 'w-full h-full' : 'w-1/2 h-full'}>
                    <CodeEditor
                        initialCode={code}
                        onCodeChange={handleCodeChange}
                        theme={currentTheme}
                        fontFamily={currentFont.family}
                        onKeyPress={playKeySound}
                    />
                </div>
                {!isFullscreen && (
                    <div className="w-1/2 h-full border-l border-gray-700">
                        <CodeRunner
                            code={code}
                            theme={currentTheme}
                            onRun={runCode}
                            onError={() => playSound('error')}
                            onSuccess={() => playSound('success')}
                        />
                    </div>
                )}
            </motion.div>

            {fontsLoaded && (
                <div className="absolute bottom-4 left-4 flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
                    {AVAILABLE_FONTS.map(font => (
                        <button
                            key={font.name}
                            onClick={() => changeFont(font)}
                            className={`px-2 py-1 text-xs rounded ${currentFont.name === font.name ? 'bg-blue-600' : 'bg-gray-700'}`}
                            style={{ fontFamily: font.family }}
                        >
                            {font.name}
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default WebEditorPage;