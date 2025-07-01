/* eslint-disable prettier/prettier */
import { IsUUID, IsNumber, Min, Max, IsString } from "class-validator";

export class CreateReviewDto {
  @IsUUID()
  vehicleId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
