import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}
