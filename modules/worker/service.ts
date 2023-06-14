import { hashSync } from 'bcryptjs';

import exclude, { excludeMut } from 'utils/exclude';
import prisma from 'utils/prismaClient';

import { WorkerCreateForm, WorkerDto, WorkerUpdateForm } from './types';

export const WorkerService = {
  async getAll() {
    const workers = await prisma.worker.findMany({});
    const workerDtos = workers.map((w) => excludeMut(w, ['password'])) satisfies WorkerDto[];
    return workerDtos;
  },

  async getById(id: number) {
    const worker = await prisma.worker.findUnique({ where: { id } });
    if (!worker) return worker;
    const workerDto = exclude(worker, ['password']) satisfies WorkerDto;
    return workerDto;
  },

  async create(worker: WorkerCreateForm) {
    const hashed = hashSync(worker.password, 12);
    const newWorker = await prisma.worker.create({
      data: {
        ...worker,
        password: hashed,
      },
    });
    const workerDto = exclude(newWorker, ['password']) satisfies WorkerDto;
    return workerDto;
  },

  async createMany(workers: WorkerCreateForm[]) {
    return prisma.worker.createMany({
      data: workers.map((w) => ({
        ...w,
        password: hashSync(w.password, 12),
      })),
    });
  },

  async update(worker: WorkerUpdateForm) {
    const hashed = worker.password ? hashSync(worker.password, 12) : undefined;
    const newWorker = await prisma.worker.update({
      where: {
        id: worker.id,
      },
      data: {
        ...worker,
        password: hashed,
      },
    });
    const workerDto = exclude(newWorker, ['password']) satisfies WorkerDto;
    return workerDto;
  },

  async delete(id: number) {
    return prisma.worker.delete({
      where: {
        id,
      },
    });
  },
};
