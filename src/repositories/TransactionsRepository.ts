import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((total: number, item: Transaction) => {
        return Number(total + Number(item.value));
      }, 0);

    const outcome = transactions
      .filter(t => t.type === 'outcome')
      .reduce((total: number, item: Transaction) => {
        return Number(total + Number(item.value));
      }, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
