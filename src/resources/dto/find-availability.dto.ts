import { IsDateString, IsOptional, IsEnum, IsString } from 'class-validator';
import { TypeResource } from 'src/common/enums/resource.enums';


export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FindAvailabilityDto {
  @IsDateString({}, { message: 'startDate debe ser una fecha válida (ISO 8601)' })
  startDate: string;

  @IsDateString({}, { message: 'endDate debe ser una fecha válida (ISO 8601)' })
  endDate: string;

  @IsOptional()
  @IsEnum(TypeResource, {
    message: `El tipo de recurso debe ser uno de los siguientes: ${Object.values(TypeResource).join(', ')}`,
  })
  type?: TypeResource;

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser texto' })
  location?: string;

  @IsOptional()
  @IsString({ message: 'El estado debe ser texto' })
  status?: string;

  @IsOptional()
  @IsString({ message: 'El campo de ordenamiento debe ser texto' })
  orderBy?: string;

  @IsOptional()
  @IsEnum(OrderDirection, {
    message: `La dirección del orden debe ser 'ASC' o 'DESC'`,
  })
  order?: OrderDirection = OrderDirection.ASC;
}
