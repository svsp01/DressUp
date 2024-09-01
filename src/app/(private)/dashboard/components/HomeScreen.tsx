'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Bell, MessageSquare, PlusCircle, Wand2,  MessageCircle, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DressUp {
    id: number;
    title: string;
    imgUrl: string;
}

interface Trend {
    id: number;
    title: string;
    imgUrl: string;
}

const generateDummyData = (count: number, type: 'dressUp' | 'trend'): (DressUp | Trend)[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `${type === 'dressUp' ? 'Dress-Up' : 'Trend'} ${i + 1}`,
        imgUrl: `https://picsum.photos/${300 + i}/${400 + i}`,
    }));
};

const HomeScreen: React.FC = () => {
    const [dressUps] = useState<DressUp[]>(generateDummyData(5, 'dressUp') as DressUp[]);
    const [trends] = useState<Trend[]>(generateDummyData(8, 'trend') as Trend[]);
    const [mostUsed] = useState<DressUp[]>(generateDummyData(3, 'dressUp') as DressUp[]);
    const router = useRouter();
    const currentSeason = 'Autumn';

    const navigateTo = (screen: string) => {
        router.push(`/${screen}`);
    };

    return (
        <div className="p-4 space-y-6 bg-gray-900 text-white min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex space-x-4">
                    <Button size="icon" variant="outline">
                        <Bell className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="outline">
                        <MessageSquare className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Quick Actions */}
            <section className="grid grid-cols-3 gap-4">
                <Button
                    size="lg"
                    variant="outline"
                    className="flex flex-col items-center py-4"
                    onClick={() => navigateTo('try-on')}
                >
                    <Wand2 className="w-6 h-6 mb-2" />
                    Try-On
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="flex flex-col items-center py-4"
                    onClick={() => navigateTo('trends')}
                >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    Trends
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="flex flex-col items-center py-4"
                    onClick={() => navigateTo('ai-chat')}
                >
                    <MessageCircle className="w-6 h-6 mb-2" />
                    AI Chat
                </Button>
            </section>

            {/* Recent Dress-Ups */}
            <section className="space-y-2">
                <h2 className="text-xl font-semibold">Your Recent Dress-Ups</h2>
                <Carousel className="w-full">
                    <CarouselContent>
                        {dressUps.map((dressUp) => (
                            <CarouselItem key={dressUp.id} className="md:basis-1/2 lg:basis-1/3">
                                <Card className="bg-gray-800 border-gray-700">
                                    <CardContent className="p-0">
                                        <img src={dressUp.imgUrl} alt={dressUp.title} className="rounded-t-lg w-full h-[200px] object-cover" />
                                    </CardContent>
                                    <CardFooter className="p-2 flex justify-between items-center">
                                        <span>{dressUp.title}</span>
                                        <Button size="sm" variant="ghost">
                                            <PlusCircle className="w-4 h-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </section>

            {/* Latest Trends */}
            <section className="space-y-2">
                <h2 className="text-xl font-semibold">Latest Trends</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {trends.map((trend) => (
                        <motion.div
                            key={trend.id}
                            className="relative rounded-lg overflow-hidden shadow-lg"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img src={trend.imgUrl} alt={trend.title} className="w-full h-[250px] object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-between items-center">
                                <span>{trend.title}</span>
                                <Button size="sm" variant="ghost">
                                    <PlusCircle className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Most Used */}
            <section className="space-y-2">
                <h2 className="text-xl font-semibold">Most Used</h2>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {mostUsed.map((item) => (
                        <Card key={item.id} className="w-[200px] flex-shrink-0 bg-gray-800 border-gray-700">
                            <CardContent className="p-0">
                                <img src={item.imgUrl} alt={item.title} className="rounded-t-lg w-full h-[150px] object-cover" />
                            </CardContent>
                            <CardFooter className="p-2 flex justify-between items-center">
                                <span>{item.title}</span>
                                <Button size="sm" variant="ghost">
                                    <PlusCircle className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Seasonal Picks */}
            <section className="space-y-2">
                <h2 className="text-xl font-semibold">{currentSeason} Picks</h2>
                <div className="grid grid-cols-2 gap-4">
                    {trends.slice(0, 2).map((trend) => (
                        <Card key={trend.id} className="w-full bg-gray-800 border-gray-700">
                            <CardContent className="p-0">
                                <img src={trend.imgUrl} alt={trend.title} className="rounded-t-lg w-full h-[200px] object-cover" />
                            </CardContent>
                            <CardFooter className="flex-col items-start">
                                <h3 className="text-lg font-bold">{trend.title}</h3>
                                <p className="text-gray-400">Check out the latest in {trend.title} for {currentSeason}.</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomeScreen;