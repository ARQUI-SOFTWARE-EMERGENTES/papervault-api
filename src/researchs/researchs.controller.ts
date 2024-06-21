import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ResearchsService } from './researchs.service';
import { UploadResearchDto } from './dto/UploadResearch.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/researchs')
@ApiTags('researchs')
export class ResearchsController {
    constructor(private researchsService: ResearchsService) {}

    @Post()
    @UseGuards(AuthGuard())
    uploadResearch(@Body() uploadResearchDto: UploadResearchDto, @Req() req){
        return this.researchsService.uploadResearch(uploadResearchDto, req.user);
    }

    @Get()
    getAllResearchs(@Query('search') search: string) {
        return this.researchsService.getAllResearchs(search);
    }

    @Get('status/approved')
    @UseGuards(AuthGuard())
    getApprovedResearchs(@Req() req) {
        return this.researchsService.getApprovedResearchs(req.user);
    }

    @Get('status/pending')
    @UseGuards(AuthGuard())
    getPendingResearchs(@Req() req) {
        return this.researchsService.getPendingResearchs(req.user);
    }

    @Get('status/rejected')
    @UseGuards(AuthGuard())
    getRejectedResearchs(@Req() req) {
        return this.researchsService.getRejectedResearchs(req.user);
    }

    @Put('approve/:id')
    @UseGuards(AuthGuard())
    approveResearch(@Param('id') id: string, @Req() req) {
        return this.researchsService.approveResearch(id, req.user);
    }

    @Put('reject/:id')
    @UseGuards(AuthGuard())
    rejectResearch(@Param('id') id: string, @Req() req) {
        return this.researchsService.declineResearch(id, req.user);
    }

    @Get('revision')
    @UseGuards(AuthGuard())
    getRevisionResearchs(@Req() req) {
        return this.researchsService.getRevisionResearchs(req.user);
    }

    @Get(':id')
    getResearchById(@Param('id') id: string) {
        return this.researchsService.getResearchById(id);
    }
}
