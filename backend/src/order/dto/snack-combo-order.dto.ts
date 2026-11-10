import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class SnackComboOrderDto {
  @ApiProperty({
    description: 'The UUID of the snack combo.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  snackComboId: string;

  @ApiProperty({
    description: 'The quantity of the snack combo.',
    example: 2,
  })
  @IsInt()
  @Min(1)
  @Max(2147483647)
  quantity: number;
}
