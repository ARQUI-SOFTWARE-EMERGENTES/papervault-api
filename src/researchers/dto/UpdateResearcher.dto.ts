import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateResearcherDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    lastname: string;

    @IsOptional()
    @IsEmail()
    email: string;
}