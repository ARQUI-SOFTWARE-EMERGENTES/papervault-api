import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ResearchersService } from './researchers.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateResearcherDto } from './dto/UpdateResearcher.dto';

@Controller('api/v1/researchers')
export class ResearchersController {
    constructor(private researchersService: ResearchersService) {}

    @Get()
    @UseGuards(AuthGuard())
    getProfile(@Req() req) {
        return this.researchersService.getProfile(req.user);
    }

    @Put()
    @UseGuards(AuthGuard())
    updateProfile(@Req() req, @Body() updateResearcherDto: UpdateResearcherDto) {
        return this.researchersService.updateProfile(req.user, updateResearcherDto);
    }
}
