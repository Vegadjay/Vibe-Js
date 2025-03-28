'use client';

export interface Theme {
    name: string;
    background: string;
    editorBackground: string;
    text: string;
    accent: string;
    syntaxColors: {
        keyword: string;
        string: string;
        function: string;
        comment: string;
    };
    codeMirrorTheme: 'light' | 'dark' | 'dracula' | 'nord' | 'solarized' | 'monokai';
}

const THEMES: Record<string, Theme> = {
    dark: {
        name: 'Dark Pro',
        background: '#1E1E1E',
        editorBackground: '#252526',
        text: '#D4D4D4',
        accent: '#007ACC',
        syntaxColors: {
            keyword: '#569CD6',
            string: '#CE9178',
            function: '#DCDCAA',
            comment: '#6A9955'
        },
        codeMirrorTheme: 'dark'
    },
    light: {
        name: 'Light Pro',
        background: '#FFFFFF',
        editorBackground: '#F3F3F3',
        text: '#000000',
        accent: '#0078D4',
        syntaxColors: {
            keyword: '#0000FF',
            string: '#A31515',
            function: '#795E26',
            comment: '#008000'
        },
        codeMirrorTheme: 'light'
    },
    monokai: {
        name: 'Monokai',
        background: '#272822',
        editorBackground: '#2D2E28',
        text: '#F8F8F2',
        accent: '#F92672',
        syntaxColors: {
            keyword: '#F92672',
            string: '#E6DB74',
            function: '#A6E22E',
            comment: '#75715E'
        },
        codeMirrorTheme: 'monokai'
    },
    oceanicNext: {
        name: 'Oceanic Next',
        background: '#1B2B34',
        editorBackground: '#343D46',
        text: '#CDD3DE',
        accent: '#6699CC',
        syntaxColors: {
            keyword: '#EC5F67',
            string: '#99C794',
            function: '#FAC863',
            comment: '#65737E'
        },
        codeMirrorTheme: 'dark'
    },
    solarizedDark: {
        name: 'Solarized Dark',
        background: '#002B36',
        editorBackground: '#073642',
        text: '#93A1A1',
        accent: '#268BD2',
        syntaxColors: {
            keyword: '#859900',
            string: '#2AA198',
            function: '#B58900',
            comment: '#586E75'
        },
        codeMirrorTheme: 'solarized'
    },
    dracula: {
        name: 'Dracula',
        background: '#282A36',
        editorBackground: '#44475A',
        text: '#F8F8F2',
        accent: '#BD93F9',
        syntaxColors: {
            keyword: '#FF79C6',
            string: '#F1FA8C',
            function: '#50FA7B',
            comment: '#6272A4'
        },
        codeMirrorTheme: 'dracula'
    },
    gruvboxDark: {
        name: 'Gruvbox Dark',
        background: '#282828',
        editorBackground: '#3C3836',
        text: '#EBDBB2',
        accent: '#D79921',
        syntaxColors: {
            keyword: '#FB4934',
            string: '#B8BB26',
            function: '#FABD2F',
            comment: '#928374'
        },
        codeMirrorTheme: 'dark'
    },
    nord: {
        name: 'Nord',
        background: '#2E3440',
        editorBackground: '#3B4252',
        text: '#D8DEE9',
        accent: '#81A1C1',
        syntaxColors: {
            keyword: '#81A1C1',
            string: '#A3BE8C',
            function: '#88C0D0',
            comment: '#616E88'
        },
        codeMirrorTheme: 'nord'
    },
    github: {
        name: 'GitHub',
        background: '#FFFFFF',
        editorBackground: '#F6F8FA',
        text: '#24292E',
        accent: '#0366D6',
        syntaxColors: {
            keyword: '#D73A49',
            string: '#032F62',
            function: '#6F42C1',
            comment: '#6A737D'
        },
        codeMirrorTheme: 'light'
    },
    material: {
        name: 'Material',
        background: '#263238',
        editorBackground: '#2C3B41',
        text: '#EEFFFF',
        accent: '#82AAFF',
        syntaxColors: {
            keyword: '#C792EA',
            string: '#C3E88D',
            function: '#82AAFF',
            comment: '#546E7A'
        },
        codeMirrorTheme: 'dark'
    }
};

export default THEMES;