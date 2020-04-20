import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepositoy = getRepository(Category);

    const { total } = await transactionRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError("You don't have enough balance");
    }

    let transactionCategory = await categoryRepositoy.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepositoy.create({
        title: category,
      });

      await categoryRepositoy.save(transactionCategory);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: transactionCategory,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
