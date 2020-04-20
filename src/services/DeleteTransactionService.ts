import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transantion = await transactionRepository.findOne({ where: { id } });

    if (!transantion) {
      throw new AppError('Transaction does not exist');
    }

    await transactionRepository.remove(transantion);
  }
}

export default DeleteTransactionService;
