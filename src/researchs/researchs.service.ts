import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { UploadResearchDto } from './dto/UploadResearch.dto';
import * as researchsContractJson from '../researchsContracts/build/contracts/ResearchsContract.json';

import  Web3 from 'web3';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Research } from 'src/schemas/Research.schema';
import { Researcher } from 'src/schemas/Researcher.schema';
import { publish } from 'rxjs';

@Injectable()
export class ResearchsService implements OnModuleInit {
    private researchsInstance: any;
    private fromAddress: string;
    private contract = require("@truffle/contract");

    constructor(
        @InjectModel(Research.name) private researchModel: Model<Research>,
        @InjectModel(Researcher.name) private researcherModel: Model<Researcher>
    ) {}

    async onModuleInit() {
        const researchsContract = this.contract(researchsContractJson);
        researchsContract.setProvider('http://localhost:7545');
        this.researchsInstance = await researchsContract.deployed();

        const web3 = new Web3('http://localhost:7545');
        const accounts = await web3.eth.getAccounts();
        this.fromAddress = accounts[0];
    }

    async uploadResearch(uploadResearchDto: UploadResearchDto, researcher: Researcher) {
        const { title, abstract, content, publishedDate, authors, journal, volume, issue, pages, doi } = uploadResearchDto;
        
        const result = await this.researchsInstance.uploadResearch(title, abstract, content, doi, researcher._id.toString(), { from: this.fromAddress });

        const newResearch = new this.researchModel({
            publishedDate,
            authors,
            journal,
            volume,
            issue,
            pages,
            doi,
            counter: result.logs[0].args.counter,
        });

        await newResearch.save();
        return result.logs[0].args;
    }

    async getAllResearchs(search: string) {
        const researchs = await this.researchModel.find();

        let approvedResearchs = [];

        for (let i = 0; i < researchs.length; i++) {
            const result = await this.researchsInstance.getResearch(researchs[i].counter, { from: this.fromAddress });
            if (result[4] === '1' && result[0].toString().toLowerCase().includes(search.toLowerCase()) ) {
                const researcher = await this.researcherModel.findById(result[5]);
                approvedResearchs.push({
                    id: researchs[i]._id,
                    title: result[0],
                    abstract: result[1],
                    content: result[2],
                    authors: researchs[i].authors,
                    journal: researchs[i].journal,
                    doi: result[3],
                    status: result[4],
                    publishedDate: researchs[i].publishedDate,
                    uploadedBy: researcher.name + ' ' + researcher.lastname,
                    actionBy: result[6],
                });
            }
        }

        return approvedResearchs;
    }

    async getResearchById(id: string) {
        if (mongoose.Types.ObjectId.isValid(id) === false) throw new HttpException('Invalid research id', 400);

        const research = await this.researchModel.findById(id)
        if (!research) throw new HttpException('Research not found', 404);

        const result = await this.researchsInstance.getResearch(research.counter, { from: this.fromAddress });
        return {
            title: result[0],
            abstract: result[1],
            content: result[2],
            doi: result[3],
            status: result[4],
            authors: research.authors,
            journal: research.journal,
            volume: research.volume,
            issue: research.issue,
            pages: research.pages,
            publishedDate: research.publishedDate,
            uploadedBy: result[5],
            actionBy: result[6],
        }
    };

    async getRevisionResearchs(researcher: Researcher) {
        const researchs = await this.researchModel.find();

        let pendingResearchs = [];

        for (let i = 0; i < researchs.length; i++) {
            const result = await this.researchsInstance.getResearch(researchs[i].counter, { from: this.fromAddress });
            if (result[4] == 0 && result[5] != researcher._id) {
                const researcher = await this.researcherModel.findById(result[5]);
                pendingResearchs.push({
                    id: researchs[i]._id,
                    title: result[0],
                    abstract: result[1],
                    content: result[2],
                    doi: result[3],
                    status: result[4],
                    uploadedBy: researcher.name + ' ' + researcher.lastname,
                    actionBy: result[6],
                });
            }
        }

        return pendingResearchs;
    }

    async approveResearch(id: string, researcher: Researcher) {
        const research = await this.researchModel.findById(id);
        if (!research) throw new HttpException('Research not found', 404);

        const result = await this.researchsInstance.approveResearch(research.counter, researcher._id.toString(), { from: this.fromAddress });

        await this.researchModel.findByIdAndUpdate(id, { counter: result.logs[0].args.counter}, { new: true });

        return result.logs[0].args;
    }

    async declineResearch(id: string, researcher: Researcher) {
        const research = await this.researchModel.findById(id);
        if (!research) throw new HttpException('Research not found', 404);

        const result = await this.researchsInstance.rejectResearch(research.counter, researcher._id.toString(), { from: this.fromAddress });

        await this.researchModel.findByIdAndUpdate(id, { counter: result.logs[0].args.counter}, { new: true });

        return result.logs[0].args;
    }

    async getApprovedResearchs(researcher: Researcher) {
        const researchs = await this.researchModel.find();

        let approvedResearchs = [];

        for (let i = 0; i < researchs.length; i++) {
            const result = await this.researchsInstance.getResearch(researchs[i].counter, { from: this.fromAddress });
            if (result[4] === '1' && result[5] == researcher._id) {
                const researcher = await this.researcherModel.findById(result[5]);
                approvedResearchs.push({
                    id: researchs[i]._id,
                    title: result[0],
                    abstract: result[1],
                    content: result[2],
                    authors: researchs[i].authors,
                    journal: researchs[i].journal,
                    doi: result[3],
                    status: result[4],
                    uploadedBy: researcher.name + ' ' + researcher.lastname,
                    actionBy: result[6],
                });
            }
        }

        return approvedResearchs;
    }

    async getPendingResearchs(researcher: Researcher) {
        const researchs = await this.researchModel.find();

        let pendingResearchs = [];

        for (let i = 0; i < researchs.length; i++) {
            const result = await this.researchsInstance.getResearch(researchs[i].counter, { from: this.fromAddress });
            if (result[4] === '0' && result[5] == researcher._id) {
                const researcher = await this.researcherModel.findById(result[5]);
                pendingResearchs.push({
                    id: researchs[i]._id,
                    title: result[0],
                    abstract: result[1],
                    content: result[2],
                    authors: researchs[i].authors,
                    journal: researchs[i].journal,
                    doi: result[3],
                    status: result[4],
                    uploadedBy: researcher.name + ' ' + researcher.lastname,
                    actionBy: result[6],
                });
            }
        }

        return pendingResearchs;
    }

    async getRejectedResearchs(researcher: Researcher) {
        const researchs = await this.researchModel.find();

        let rejectedResearchs = [];

        for (let i = 0; i < researchs.length; i++) {
            const result = await this.researchsInstance.getResearch(researchs[i].counter, { from: this.fromAddress });
            if (result[4] === '2' && result[5] == researcher._id) {
                const researcher = await this.researcherModel.findById(result[5]);
                rejectedResearchs.push({
                    id: researchs[i]._id,
                    title: result[0],
                    abstract: result[1],
                    content: result[2],
                    authors: researchs[i].authors,
                    journal: researchs[i].journal,
                    doi: result[3],
                    status: result[4],
                    uploadedBy: researcher.name + ' ' + researcher.lastname,
                    actionBy: result[6],
                });
            }
        }

        return rejectedResearchs;
    }
}
