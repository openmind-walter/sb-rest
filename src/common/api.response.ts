import { ApiProperty } from '@nestjs/swagger';

export enum ApiMessage {
  SUCCESS = 'Success',
  ERROR = 'Error',
  FAILURE = 'Failure',
}

export class ApiResponseDto {
  @ApiProperty()
  message: ApiMessage | string;

  @ApiProperty()
  data: any;

  constructor(message: ApiMessage | string, data: any) {
    this.message = message;
    this.data = data;
  }
}
