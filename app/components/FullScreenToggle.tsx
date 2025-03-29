'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Expand, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullScreenToggleProps {
    children: React.ReactNode;
    initialFullScreen?: boolean;
    className?: string;
}

const FullScreenToggle: React.FC<FullScreenToggleProps> = ({
    children,
    initialFullScreen = false,
    className = ''
}) => {
    const [isFullScreen, setIsFullScreen] = useState(initialFullScreen);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

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
                } ${className}`}
            style={{
                backgroundColor: isFullScreen || isMaximized ? '#1E1E1E' : 'transparent'
            }}
        >
            <div className="absolute top-2 right-2 z-10 flex space-x-1 md:space-x-2">
                <Button
                    variant="outline"
                    size={isMobile ? "sm" : "icon"}
                    onClick={toggleMaximize}
                    title={isMaximized ? "Restore" : "Maximize"}
                    className="bg-opacity-80 backdrop-blur-sm hover:bg-opacity-100 transition-all"
                >
                    {isMaximized ? <Minimize size={isMobile ? 14 : 16} /> : <Expand size={isMobile ? 14 : 16} />}
                </Button>
                <Button
                    variant="outline"
                    size={isMobile ? "sm" : "icon"}
                    onClick={toggleFullScreen}
                    title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                    className="bg-opacity-80 backdrop-blur-sm hover:bg-opacity-100 transition-all"
                >
                    {isFullScreen ? <Minimize2 size={isMobile ? 14 : 16} /> : <Maximize2 size={isMobile ? 14 : 16} />}
                </Button>
            </div>

            <motion.div
                layout
                className={`w-full h-full overflow-auto ${isFullScreen || isMaximized
                        ? 'p-2 sm:p-3 md:p-4'
                        : ''
                    }`}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default FullScreenToggle;