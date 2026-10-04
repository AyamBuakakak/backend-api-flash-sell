import { IsInt, IsNotEmpty, IsNumber, IsString, min, Min, MinLength } from 'class-validator';
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {})
    name: string;

    @IsInt()
    @IsNotEmpty()
    @Min(0, {})
    stock: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
