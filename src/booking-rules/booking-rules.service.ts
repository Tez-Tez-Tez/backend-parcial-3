import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingRulesEntity } from './entity/booking-rules.entity';
import { TypeResource } from 'src/common/enums/resource.enums';

@Injectable()
export class BookingRulesService {
    constructor(
        @InjectRepository(BookingRulesEntity)
        private readonly bookingRulesRepository: Repository<BookingRulesEntity>,
    ) { }

    async create(rule: Partial<BookingRulesEntity>): Promise<BookingRulesEntity> {
        return this.bookingRulesRepository.save(rule);
    }

    async findAll(): Promise<BookingRulesEntity[]> {
        return this.bookingRulesRepository.find();
    }

    async findOne(id: number): Promise<BookingRulesEntity> {
        return this.bookingRulesRepository.findOneBy({ id });
    }

    async update(id: number, rule: Partial<BookingRulesEntity>): Promise<BookingRulesEntity> {
        await this.bookingRulesRepository.update(id, rule);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.bookingRulesRepository.delete(id);
    }

    async findApplicableRule(resourceId: number, resourceType: TypeResource): Promise<BookingRulesEntity> {
        // Priority: Specific Resource Rule > specific Resource Type Rule > Global Default (both null)
        const specificRule = await this.bookingRulesRepository.findOne({
            where: { resourceId, resourceType },
        });
        if (specificRule) return specificRule;

        const typeRule = await this.bookingRulesRepository.findOne({
            where: { resourceType, resourceId: null },
        });
        if (typeRule) return typeRule;

        const globalRule = await this.bookingRulesRepository.findOne({
            where: { resourceType: null, resourceId: null }
        });

        // Return a default object if no rule exists in DB to avoid crashes, 
        // or return null and handle defaults in business logic. 
        // Here we return null if absolutely nothing found, but you might want to seed a default.
        return globalRule;
    }
}
