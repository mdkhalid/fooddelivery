import { prisma } from '../config/database';

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: any, page?: number, limit?: number): Promise<{ data: T[]; total: number }>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<void>;
  exists(filter: any): Promise<boolean>;
  count(filter?: any): Promise<number>;
}

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected model: any) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(filter: any = {}, page = 1, limit = 20): Promise<{ data: T[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.findMany({ where: filter, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.model.count({ where: filter }),
    ]);
    return { data, total };
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

  async exists(filter: any): Promise<boolean> {
    const count = await this.model.count({ where: filter });
    return count > 0;
  }

  async count(filter: any = {}): Promise<number> {
    return this.model.count({ where: filter });
  }
}
