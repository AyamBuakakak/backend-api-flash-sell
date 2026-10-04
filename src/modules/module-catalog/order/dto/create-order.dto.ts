import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateOrderItemDto {
    @IsUUID('4', { message: 'ID Produk harus berupa UUID v4 yang valid' })
    productId: string;

    @IsInt({ message: 'Kuantitas harus berupa angka bulat' })
    @Min(1, { message: 'Kuantitas minimal pembelian adalah 1' })
    @Max(5, { message: 'Maksimal pembelian flash sale dibatasi 5 item per produk' })
    quantity: number;
}

