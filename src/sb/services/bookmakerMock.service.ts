import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getMockBookMakers } from 'src/data/bookmark';
import { BookmakerData, BookmakerRunner, BookmakerRunnerStaus, BookmakerStaus } from 'src/model/bookmaker';
// Adjust the path as needed

@Injectable()
export class BookmakerMockService implements OnModuleInit, OnModuleDestroy {
    private bookmakerData: BookmakerData[] = [];
    private intervalId: NodeJS.Timeout | null = null;

    onModuleInit() {
        this.initializeMockData();
        this.startMockUpdates();
    }

    onModuleDestroy() {
        this.stopMockUpdates();
    }

    private initializeMockData() {
        // Mock initial data
        this.bookmakerData = getMockBookMakers()
    }

    private startMockUpdates() {
        this.intervalId = setInterval(() => {
            this.updateBookmakerStatuses();
        }, this.getRandomInterval());
    }

    private stopMockUpdates() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private updateBookmakerStatuses() {
        this.bookmakerData = this.bookmakerData.map((bookmaker) => {
            // Randomize bookmaker status
            bookmaker.status = this.getRandomBookmakerStatus();

            // Randomize runner statuses and prices
            bookmaker.runners = Object.keys(bookmaker.runners).reduce((acc, key) => {
                const runner = bookmaker.runners[key];
                acc[key] = {
                    ...runner,
                    status: this.getRandomRunnerStatus(),
                    back_price: this.increaseRandomly(runner.back_price, 1, 10),
                    lay_price: this.increaseRandomly(runner.lay_price, 1, 10),
                };
                return acc;
            }, {} as Record<string, BookmakerRunner>);

            return bookmaker;
        });

        // console.log('Updated Bookmaker Data:', JSON.stringify(this.bookmakerData, null, 2));
    }

    private getRandomInterval() {
        return Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000; // Random between 5 and 10 seconds
    }

    private getRandomBookmakerStatus(): BookmakerStaus {
        const statuses = [
            BookmakerStaus.OPEN,
            BookmakerStaus.BALL_RUNNING,
            BookmakerStaus.CLOSED,
            BookmakerStaus.SUSPENDED,
            BookmakerStaus.REMOVED,
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    private getRandomRunnerStatus(): BookmakerRunnerStaus {
        const statuses = [
            BookmakerRunnerStaus.ACTIVE,
            BookmakerRunnerStaus.LOSER,
            BookmakerRunnerStaus.BALL_RUNNING,
            BookmakerRunnerStaus.CLOSED,
            BookmakerRunnerStaus.SUSPENDED,
            BookmakerRunnerStaus.REMOVED,
            BookmakerRunnerStaus.WINNER,
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    private increaseRandomly(value: number, minIncrement: number, maxIncrement: number): number {
        const increment = Math.random() * (maxIncrement - minIncrement) + minIncrement;
        return parseFloat((value + increment).toFixed(2)); // Ensure precision to 2 decimal places
    }

    // Method to retrieve the current data
    getBookmakerData(): BookmakerData[] {
        return this.bookmakerData;
    }

    getEvent(eventId: string): BookmakerData | null {
        return this.bookmakerData.find(event => event.event_id === eventId) || null;
    }
}
