import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidationOptions,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

interface StringDecoratorOptions extends ValidationOptions {
  required?: boolean;
  example?: string;
  description?: string;
  swagger?: Omit<ApiPropertyOptions, 'example' | 'description'>;
}

export function PhoneNumberDecorator(options?: StringDecoratorOptions) {
  return applyDecorators(
    IsPhoneNumber(),
    ApiProperty({
      example: options?.example,
      description: options?.description,
      ...options?.swagger,
    }),
    IsNotEmpty(),
    Transform(({ value }: TransformFnParams): string => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    }),
  );
}

export function EmailDecorator(options?: StringDecoratorOptions) {
  return applyDecorators(
    IsEmail(),
    ApiProperty({
      example: options?.example,
      description: options?.description,
      ...options?.swagger,
    }),
    options.required ? IsNotEmpty() : IsOptional(),
    Transform(({ value }: TransformFnParams): string => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    }),
  );
}

export function TrimStringDecorator(options?: StringDecoratorOptions) {
  return applyDecorators(
    IsString(options),
    ApiProperty({
      example: options?.example,
      description: options?.description,
      ...options?.swagger,
    }),
    options.required ? IsNotEmpty() : IsOptional(),
    Transform(({ value }: TransformFnParams): string => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    }),
  );
}
