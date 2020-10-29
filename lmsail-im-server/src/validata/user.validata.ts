import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

// 登录验证器
export class AuthLogin {
    @ApiProperty({ description: '用户名', example: 'lmsail' })
    @IsNotEmpty({ message: '缺少用户名' })
    @MinLength(2, { message: '用户名长度不能小于2' })
    @MaxLength(8, { message: '用户名长度不能超过8' })
    username: string

    @ApiProperty({ description: '密码', example: '112233' })
    @IsNotEmpty({ message: '缺少密码' })
    @MinLength(6, { message: '密码长度不能小于6' })
    @MaxLength(16, { message: '密码长度不能超过16' })
    password: string
}

// 注册验证器
export class AuthRegister {
    @ApiProperty({ description: '用户名', example: 'lmsail' })
    @IsNotEmpty({ message: '缺少用户名' })
    @MinLength(2, { message: '用户名长度不能小于2' })
    @MaxLength(8, { message: '用户名长度不能超过8' })
    username: string

    @ApiProperty({ description: '昵称', example: '帅' })
    @IsNotEmpty({ message: '缺少昵称' })
    @MinLength(2, { message: '昵称长度不能小于2' })
    @MaxLength(8, { message: '昵称长度不能超过8' })
    nickname: string

    @ApiProperty({ description: '密码', example: '123456' })
    @IsNotEmpty({ message: '缺少密码' })
    @MinLength(6, { message: '密码长度不能小于6' })
    @MaxLength(16, { message: '密码长度不能超过16' })
    password: string
}

// 获取用户信息的验证器
export class UserFindDto {
    @ApiProperty({ description: '用户编号，不传默认返回自己的信息', example: 1 })
    id: number
}

// 修改用户信息验证器
export class UserInfoDto {
    @ApiProperty({ description: '字段名', example: 'nickname' })
    @IsNotEmpty({ message: '缺少需要更新的字段名' })
    fieldName: string

    @ApiProperty({ description: '字段值', example: '王者荣耀' })
    @IsNotEmpty({ message: '缺少字段值' })
    fieldValue: string
}

// 修改密码验证器
export class UserPasswordDto {
    @ApiProperty({ description: '旧密码', example: '123456' })
    @IsNotEmpty({ message: '缺少旧密码' })
    @MinLength(6, { message: '密码长度不能小于6' })
    @MaxLength(16, { message: '密码长度不能超过16' })
    password: string

    @ApiProperty({ description: '新密码', example: '112233' })
    @IsNotEmpty({ message: '缺少新密码' })
    @MinLength(6, { message: '密码长度不能小于6' })
    @MaxLength(16, { message: '密码长度不能超过16' })
    new_password: string
}

// 用户搜索的验证器
export class UserSearchDto {
    @ApiProperty({ description: '搜索关键字', example: '高圆圆' })
    @IsNotEmpty({ message: '缺少搜索关键字' })
    @MaxLength(6, { message: '搜索关键字长度不能超过6' })
    keyword: string
}