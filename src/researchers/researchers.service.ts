import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Researcher } from 'src/schemas/Researcher.schema';
import { UpdateResearcherDto } from './dto/UpdateResearcher.dto';

@Injectable()
export class ResearchersService {
    constructor(@InjectModel(Researcher.name) private researcherModel: Model<Researcher>) {}

    getProfile(researcher: Researcher) {
        return this.researcherModel.findById(researcher._id);
    }

    updateProfile(researcher: Researcher, updateResearcherDto: UpdateResearcherDto) {
        return this.researcherModel.findByIdAndUpdate(researcher._id, updateResearcherDto, { new: true });
    }
}
