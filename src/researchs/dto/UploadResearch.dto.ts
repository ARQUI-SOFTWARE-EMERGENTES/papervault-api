import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class UploadResearchDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    abstract: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    publishedDate: string;

    @IsString()
    @IsNotEmpty()
    authors: string;

    @IsString()
    @IsNotEmpty()
    journal: string;

    @IsString()
    @IsNotEmpty()
    volume: string;

    @IsString()
    @IsNotEmpty()
    issue: string;

    @IsString()
    @IsNotEmpty()
    pages: string;

    @IsString()
    @IsNotEmpty()
    doi: string;
}