import { Controller, Get, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TypeResource, Status } from 'src/common/enums/resource.enums';

@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }

  @ApiOperation({ summary: 'Obtener todos los recursos con filtros y ordenamiento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recursos filtrados y ordenados',
    schema: {
      example: [
        { id: 1, type: 'ROOM', name: 'Sala A', capacity: 10, status: 'available' },
        { id: 2, type: 'VEHICLE', brand: 'Toyota', model: 'Corolla', plate: 'ABC-123', status: 'available' }
      ]
    }
  })
  @ApiQuery({ name: 'type', description: 'Filtrar por tipo de recurso', enum: TypeResource, required: false })
  @ApiQuery({ name: 'status', description: 'Filtrar por estado', enum: Status, required: false })
  @ApiQuery({ name: 'sortBy', description: 'Campo por el cual ordenar', required: false, example: 'name' })
  @ApiQuery({ name: 'order', description: 'Orden ascendente o descendente', enum: ['ASC', 'DESC'], required: false })
  @Get()
  async findAll(
    @Query('type') type?: TypeResource,
    @Query('status') status?: Status,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    // This would need to be implemented in the service
    // For now, return a simple message
    return {
      message: 'Resources endpoint - filtering and sorting to be implemented',
      filters: { type, status, sortBy, order }
    };
  }
}
