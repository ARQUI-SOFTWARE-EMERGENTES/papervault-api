import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInDto } from './dto/SignIn.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Researcher } from 'src/schemas/Researcher.schema';
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Researcher.name) private researcherModel: Model<Researcher>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto) {

        const researcher = await this.researcherModel.findOne({ email: signUpDto.email })
        if (researcher) throw new HttpException('Email already in use', 400)

        signUpDto.password = await bcrypt.hash(signUpDto.password, 10)

        await this.researcherModel.create(signUpDto)

        return { "msg": "Researcher created successfully" }
    }

    async signIn(signInDto: SignInDto) {
        const { email, password } = signInDto

        const researcher = await this.researcherModel.findOne({ email })
        if (!researcher) throw new UnauthorizedException('Invalid email or password')
        
        const isPasswordMatched = await bcrypt.compare(password, researcher.password)  
        if (!isPasswordMatched) throw new UnauthorizedException('Invalid email or password')

        return { token: this.jwtService.sign({ id: researcher._id })}
    }

    async validateResearcher(id: string) {
        const researcher = await this.researcherModel.findById(id)
        if (!researcher) throw new UnauthorizedException('Invalid token')

        return researcher
    }
}
