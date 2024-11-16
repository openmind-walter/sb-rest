import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { FancyEventMarket, MaraketStaus } from "src/model/fancy";

export class FancyMarketUpdateDto {
    @ApiProperty({ description: 'Creation date of the market', required:false })
    @IsOptional()
    createdDate: string;

    @ApiProperty({ description: 'Market ID', required:false })
    @IsOptional()
    marketId: string;

    @ApiProperty({ description: 'Ninew Market ID', required:false })
    @IsOptional()
    ninewMarketId: number;

    @ApiProperty({ description: 'Event ID', required:false })
    @IsOptional()
    eventId: string;

    @ApiPropertyOptional({ description: 'Operator ID' })
    @IsOptional()
    operatorId?: number;

    @ApiPropertyOptional({ description: 'Market Odds ID' })
    @IsOptional()
    marketOddsId?: string;

    @ApiProperty({ description: 'Market name', required:false })
    @IsOptional()
    marketName: string;

    @ApiProperty({ description: 'Event name', required:false })
    @IsOptional()
    eventName: string;

    @ApiProperty({ description: 'Competition name', required:false })
    @IsOptional()
    competitionName: string;

    @ApiProperty({ description: 'Category', required:false })
    @IsOptional()
    category: string;

    @ApiProperty({ description: 'External category', required:false })
    @IsOptional()
    externalCategory: string;

    @ApiProperty({ description: 'Priority', required:false })
    @IsOptional()
    priority: number;

    @ApiProperty({ description: 'Active status', required:false })
    @IsOptional()
    active: boolean;

    @ApiProperty({ description: 'Minimum bet size', required:false })
    @IsOptional()
    minBetSize: number;

    @ApiProperty({ description: 'Maximum bet size', required:false })
     @IsOptional()
    maxBetSize: number;

    @ApiProperty({ description: 'Maximum market volume', required:false })
    @IsOptional()
    maxMarketVolume: number;

    @ApiProperty({ description: 'Yes price', required:false })
    @IsOptional()
    priceYes: number;

    @ApiProperty({ description: 'No price', required:false })
    @IsOptional()
    priceNo: number;

    @ApiProperty({ description: 'Yes spread', required:false })
    @IsOptional()
    spreadYes: number;

    @ApiProperty({ description: 'No spread', required:false })
    @IsOptional()
    spreadNo: number;

    @ApiProperty({ description: 'Ball running status', required:false })
    @IsOptional()
    ballRunning: boolean;

    @ApiProperty({ description: 'Suspended status', required:false })
    @IsOptional()
    suspended: boolean;

    @ApiProperty({ description: 'Closed status', required:false })
    @IsOptional()
    closed: boolean;

    @ApiPropertyOptional({ description: 'Price result' })
    @IsOptional()
    priceResult?: number;

    @ApiProperty({ description: 'Auto update status', required:false })
    @IsOptional()
    autoUpdate: boolean;

    @ApiProperty({ description: 'Settlement date', required:false })
    @IsOptional()
    settlementDate: number;

    @ApiProperty({ description: 'Void market status', required:false })
    @IsOptional()
    voidMarket: boolean;




    static convertToFancyEventMarket(dto: Partial<FancyMarketUpdateDto>): Partial<FancyEventMarket> {
        let status: MaraketStaus;

        if (dto.ballRunning) {
            status = MaraketStaus.BALL_RUNNING;
        } else if (dto.suspended) {
            status = MaraketStaus.SUSPENDED;
        } else if (dto.closed) {
            status = MaraketStaus.CLOSED;
        } else {
            status = MaraketStaus.ACTIVE;
        }

        const result: Partial<FancyEventMarket> = {
            id: dto.ninewMarketId,
            name: dto.marketName,
            priority: dto.priority,
            bet_allow: dto.active == undefined ? undefined : dto.active ? 1 : 0,
            min_bet: dto.minBetSize,
            max_bet: dto.maxBetSize,
            b1: dto.priceYes,
            bs1: dto.spreadYes,
            l1: dto.priceNo,
            ls1: dto.spreadNo,
            status1: status,
            result: dto.priceResult || undefined,
            is_active: dto.active == undefined ? undefined : dto.active ? 1 : 0,
            in_play: dto.ballRunning == undefined ? undefined : dto.ballRunning ? 1 : 0,
            auto_suspend_time: dto.createdDate,
        };

        // Remove properties with `undefined` values
        Object.keys(result).forEach(key => {
            if (result[key as keyof FancyEventMarket] === undefined) {
                delete result[key as keyof FancyEventMarket];
            }
        });

        return result;
    }

    static fromFancyEventMarket(fancyMarket: FancyEventMarket): FancyMarketUpdateDto {
        const dto = new FancyMarketUpdateDto();
        dto.ninewMarketId = fancyMarket.id;
        dto.marketName = fancyMarket.name;
        dto.priority = fancyMarket.priority;
        dto.active = fancyMarket.status1 === MaraketStaus.ACTIVE;
        dto.minBetSize = fancyMarket.min_bet;
        dto.maxBetSize = fancyMarket.max_bet;
        dto.priceYes = fancyMarket.b1;
        dto.spreadYes = fancyMarket.bs1;
        dto.priceNo = fancyMarket.l1;
        dto.spreadNo = fancyMarket.ls1;
        dto.ballRunning = fancyMarket.status1 == MaraketStaus.BALL_RUNNING;
        dto.suspended = fancyMarket.status1 === MaraketStaus.SUSPENDED;
        dto.closed = fancyMarket.status1 === MaraketStaus.CLOSED;
        dto.priceResult = fancyMarket.result;
        dto.createdDate = fancyMarket.auto_suspend_time;

        return dto;
    }
}