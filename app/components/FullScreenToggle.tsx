'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullScreenToggleProps {
    children: React.ReactNode;
    initialFullScreen?: boolean;
}

const FullScreenToggle: React.FC<FullScreenToggleProps> = ({
    children,
    initialFullScreen = false
}) => {
    const [isFullScreen, setIsFullScreen] = useState(initialFullScreen);
    const [isMaximized, setIsMaximized] = useState(false);

    const toggleFullScreen = useCallback(() => {
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullScreen(false);
        }
    }, []);

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <motion.div
            layout
            className={`transition-all duration-300 ease-in-out relative w-full h-full ${isFullScreen
                    ? 'fixed inset-0 z-50 w-screen h-screen'
                    : isMaximized
                        ? 'fixed top-0 left-0 right-0 bottom-0 z-40'
                        : 'relative'
                }`}
            style={{
                backgroundColor: isFullScreen || isMaximized ? '#1E1E1E' : 'transparent'
            }}
        >
            <div className="absolute top-2 right-2 z-10 flex space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMaximize}
                    title={isMaximized ? "Restore" : "Maximize"}
                >
                    <Expand size={16} />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullScreen}
                    title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                    {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
            </div>

            <motion.div
                layout
                className={`w-full h-full ${isFullScreen || isMaximized ? 'p-4' : ''}`}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default FullScreenToggle;