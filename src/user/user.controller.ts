import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return await this.userService.signUp(signUpDto);
  }

  /*
   * Signin
   * */
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInDto: SignUpDto): Promise<any> {
    return await this.userService.signIn(signInDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
