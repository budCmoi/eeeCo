import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  recipientId: string;

  @IsString()
  @MinLength(1)
  firstMessage: string;

  @IsOptional()
  @IsString()
  subject?: string;
}

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  content: string;
}
