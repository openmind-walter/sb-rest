import { Injectable, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoggerService } from 'src/common/logger.service';
import { LoginRequest, LoginResponse } from 'src/model';

@Injectable()
export class SbAuthService {
    constructor(
        private readonly configService: ConfigService,
        private logger: LoggerService
    ) { }
    async login(
        loginRequest: LoginRequest,
        bindingResult: any,
    ): Promise<LoginResponse | null> {
        const fancyMarketBaseUrl = this.configService.get<string>('FANCY_MARKET_BASE_URL');
        const fancyMarketApiKey = this.configService.get<string>('FANCY_MARKET_API_KEY');
        const headers = { 'x-api-key': fancyMarketApiKey };
        const url = `${fancyMarketBaseUrl}/operator/login`;

        if (bindingResult && bindingResult.hasErrors())
            throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);

        try {
            const loginResponse = (await axios.post(url, loginRequest, { headers }))?.data as LoginResponse;
            if (loginResponse?.errorDetails) {
                this.logger.error(
                    `Login failed for request: ${JSON.stringify(loginRequest)} ${loginResponse?.errorDetails} `,
                    SbAuthService.name,
                );
                return null;
            }
            return loginResponse;
        } catch (error) {
            this.logger.error(
                `Login failed for request: ${JSON.stringify(loginRequest)}, ${error.stack}`,
                SbAuthService.name,
            );
            return null;
        }
    }
}
