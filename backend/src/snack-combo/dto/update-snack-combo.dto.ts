import { PartialType } from '@nestjs/swagger';
import { CreateSnackComboDto } from './create-snack-combo.dto';

export class UpdateSnackComboDto extends PartialType(CreateSnackComboDto) {}
