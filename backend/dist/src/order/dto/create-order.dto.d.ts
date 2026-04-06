import { SnackComboOrderDto } from './snack-combo-order.dto';
export declare class CreateOrderDto {
    userId: string;
    ticketIds?: string[];
    snackCombos?: SnackComboOrderDto[];
}
