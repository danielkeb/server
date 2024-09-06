import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  comment: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
