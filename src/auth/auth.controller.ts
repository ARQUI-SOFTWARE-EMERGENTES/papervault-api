import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInDto } from './dto/SignIn.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto)
    }

    @Post('signin')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto)
    }

}
