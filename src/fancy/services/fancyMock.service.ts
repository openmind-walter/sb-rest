import { Injectable, Logger } from "@nestjs/common";
import { getMockFancies } from "src/data/fancy";
import { FancyEvent, FancyEventMarket, MaraketStaus } from "src/model/fancy";

@Injectable()
export class FancyMockService {
    private readonly logger = new Logger(FancyMockService.name);
    private fancyEvents: FancyEvent[] = [];
    private simulationInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.initMarkets();
    }

    async initMarkets() {
        this.fancyEvents.push(...(await getMockFancies()));
        this.startMarketSimulation();
    }

    getAllFancyEvents(): FancyEvent[] {
        return this.fancyEvents;
    }

    getMarketByEventId(eventId: string): FancyEvent | null {
        return this.fancyEvents.find(event => event.event_id === eventId) || null;
    }

    startMarketSimulation() {
        this.logger.log('Market simulation started');

        // Stop any existing simulation before starting a new one
        this.stopMarketSimulation();

        // Set intervals to simulate random market value and status changes every 10 seconds
        this.simulationInterval = setInterval(() => {
            this.fancyEvents.forEach(event => {
                Object.values(event.markets).forEach(market => this.simulateMarketChanges(market));
            });
        }, 10000); // Update every 10 seconds

        // Close and reopen markets or change statuses at random times (between 1 and 5 minutes)
        this.fancyEvents.forEach(event => {
            Object.values(event.markets).forEach(market => {
                const statusChangeTime = Math.random() * (5 - 1) + 1; // Random time between 1 and 5 minutes
                const statusTimeout = statusChangeTime * 60000; // Convert minutes to milliseconds

                setTimeout(() => {
                    this.randomMarketStatusChange(market);
                }, statusTimeout);
            });
        });
    }

    stopMarketSimulation() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
            this.logger.log('Market simulation stopped');
        }
    }

    private simulateMarketChanges(market: FancyEventMarket) {
        // Check if market is active or BALL_RUNNING before changing values
        if (market.status1 === MaraketStaus.ACTIVE || market.status1 === MaraketStaus.BALL_RUNNING) {
            // Randomly update the values to whole numbers between 5 and 300
            market.b1 = this.getRandomInt(5, 300);
            market.l1 = this.getRandomInt(5, 300);

            this.logger.log(`Market ${market.name} updated: odds=${market.b1}/${market.l1}`);
        }
    }

    private randomMarketStatusChange(market: FancyEventMarket) {
        const randomStatus = this.getRandomStatus();

        switch (randomStatus) {
            case MaraketStaus.CLOSED:
                this.closeMarket(market);
                break;
            case MaraketStaus.BALL_RUNNING:
                this.setBallRunningStatus(market);
                break;
            case MaraketStaus.SUSPENDED:
                this.suspendMarket(market);
                break;
            case MaraketStaus.REMOVED:
                this.removeMarket(market);
                break;
            case MaraketStaus.ACTIVE:
                this.reopenMarket(market);
                break;
        }
    }

    private closeMarket(market: FancyEventMarket) {
        market.status1 = MaraketStaus.CLOSED;
        market.result = Math.floor(Math.random() * 100);  // Assign a random result number
        market.is_active = 0;  // Set is_active to 0
        this.logger.log(`Market ${market.name} closed with result ${market.result}`);
    }

    private reopenMarket(market: FancyEventMarket) {
        market.status1 = MaraketStaus.ACTIVE;
        market.is_active = 1;  // Set is_active back to 1
        market.result = null;  // Clear the result when reopened
        this.logger.log(`Market ${market.name} reopened`);
    }

    private suspendMarket(market: FancyEventMarket) {
        market.status1 = MaraketStaus.SUSPENDED;
        this.logger.log(`Market ${market.name} suspended`);
    }

    private setBallRunningStatus(market: FancyEventMarket) {
        market.status1 = MaraketStaus.BALL_RUNNING;
        this.logger.log(`Market ${market.name} is now BALL_RUNNING`);
    }

    private removeMarket(market: FancyEventMarket) {
        market.status1 = MaraketStaus.REMOVED;
        this.logger.log(`Market ${market.name} removed`);
    }

    // Helper function to generate random integers between min and max (inclusive)
    private getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Helper function to randomly select a market status
    private getRandomStatus(): MaraketStaus {
        const statuses = [
            MaraketStaus.ACTIVE,
            MaraketStaus.CLOSED,
            MaraketStaus.BALL_RUNNING,
            MaraketStaus.SUSPENDED,
            MaraketStaus.REMOVED,
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }
}
