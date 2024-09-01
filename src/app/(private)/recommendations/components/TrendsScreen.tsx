'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, Plus, Trash2, Flag, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface Trend {
    id: number;
    title: string;
    description: string;
    category: string;
    type: string;
    color: string;
    season: string;
    imgUrl: string;
    width: number;
    height: number;
    deleted?: boolean;
    reported?: boolean
}

const generateDummyData = (count: number): Trend[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `Trend ${i + 1}`,
        description: `Description for Trend ${i + 1}`,
        category: ['Men', 'Women', 'Unisex'][Math.floor(Math.random() * 3)],
        type: ['Shirt', 'Pants', 'Dress', 'Jacket'][Math.floor(Math.random() * 4)],
        color: ['Red', 'Blue', 'Green', 'Yellow', 'Black'][Math.floor(Math.random() * 5)],
        season: ['Spring', 'Summer', 'Autumn', 'Winter'][Math.floor(Math.random() * 4)],
        imgUrl: `https://picsum.photos/200/300.jpg`,
        width: Math.floor(Math.random() * 100) + 300,
        height: Math.floor(Math.random() * 100) + 200,
        deleted: false,
        reported: false
    }));
};

const TrendsScreen: React.FC = () => {
    const [trends, setTrends] = useState<Trend[]>(generateDummyData(20));
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
    const [feedback, setFeedback] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setTrends((prevTrends) => [...prevTrends, ...generateDummyData(10)]);
    }, [page]);

    const handleActionClick = (action: string, trend: Trend) => {
        setSelectedAction(action);
        setSelectedTrend(trend);
        setIsModalOpen(true);
    };

    const handleConfirmAction = () => {
        if (selectedAction === 'delete') {
            setTrends((prevTrends) =>
                prevTrends.map((trend) =>
                    trend.id === selectedTrend?.id ? { ...trend, deleted: true } : trend
                )
            );
            setTimeout(() => {
                setTrends((prevTrends) => prevTrends.filter((trend) => trend.id !== selectedTrend?.id));
            }, 2000);
            toast({
                title: 'Trend Deleted',
                description: 'The trend has been successfully deleted.',
            });
        } else if (selectedAction === 'report') {
            setTrends((prevTrends) =>
                prevTrends.map((trend) =>
                    trend.id === selectedTrend?.id ? { ...trend, reported: true } : trend
                )
            );
            setTimeout(() => {
                setTrends((prevTrends) => prevTrends.filter((trend) => trend.id !== selectedTrend?.id));
            }, 2000);
            toast({
                title: 'Trend Reported',
                description: 'Thank you for your report. We will review it shortly.',
            });
        } else if (selectedAction === 'addToCloset') {
            toast({
                title: 'Added to Closet',
                description: 'The trend has been successfully added to your closet.',
            });
        }
        setIsModalOpen(false);
        setFeedback('');
    };

    return (
        <div className="p-2 relative">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-2">
                <AnimatePresence>
                    {trends.map((trend) => (
                        <motion.div
                            key={trend.id}
                            className="relative mb-2 break-inside-avoid"
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src={`${trend.imgUrl}`}
                                alt={trend.title}
                                style={{ width: trend.width, height: trend.height }} 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex flex-col justify-end items-center transition-opacity duration-300 p-2">
                                <p className="text-white text-lg mb-2">{trend.title}</p>
                                <div className="flex space-x-2">
                                    <Button size="sm" onClick={() => handleActionClick('addToCloset', trend)}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleActionClick('delete', trend)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleActionClick('report', trend)}>
                                        <Flag className="w-4 h-4 mr-1" />
                                        Report
                                    </Button>
                                </div>
                            </div>
                            <Button
                                className="absolute top-2 right-2"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setSelectedTrend(trend);
                                    setShowInfo(true);
                                }}
                            >
                                <Info className="w-4 h-4" />
                            </Button>
                            {trend.deleted && (
                                <motion.div
                                    className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Check className="text-green-500" size={48} />
                                </motion.div>
                            )}
                            {trend.reported && (
                                <motion.div
                                    className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <AlertTriangle className="text-yellow-500" size={48} />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div ref={loaderRef} className="h-10 w-full" />

            <AnimatePresence>
                {isModalOpen && (
                    <Dialog onOpenChange={() => setIsModalOpen(false)} open={isModalOpen}>
                        <DialogContent>
                            <DialogHeader>{selectedAction === 'report' ? 'Report Trend' : 'Confirm Action'}</DialogHeader>
                            {selectedAction === 'report' ? (
                                <>
                                    <p>Please provide your feedback and reason for reporting this trend:</p>
                                    <Textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Enter your reason"
                                        className="mt-2"
                                    />
                                </>
                            ) : (
                                <p>Are you sure you want to {selectedAction} this trend?</p>
                            )}
                            <DialogFooter>
                                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleConfirmAction} className="ml-2">
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {showInfo && selectedTrend && (
                    <Dialog onOpenChange={() => setShowInfo(false)} open={showInfo}>
                        <DialogContent>
                            <DialogHeader>Trend Information</DialogHeader>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p><strong>Title:</strong> {selectedTrend.title}</p>
                                <p><strong>Description:</strong> {selectedTrend.description}</p>
                                <p><strong>Category:</strong> {selectedTrend.category}</p>
                                <p><strong>Type:</strong> {selectedTrend.type}</p>
                                <p><strong>Color:</strong> {selectedTrend.color}</p>
                                <p><strong>Season:</strong> {selectedTrend.season}</p>
                            </motion.div>
                            <DialogFooter>
                                <Button onClick={() => setShowInfo(false)}>Close</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrendsScreen;
