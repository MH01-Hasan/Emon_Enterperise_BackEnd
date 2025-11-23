import mongoose, { ClientSession, SortOrder, Types } from 'mongoose';
import { Pagination_helper } from '../../../halper/paginationhelper';
import { IgenericResponse } from '../../../interface/common';
import { IpaginationObject } from '../../../interface/pagination';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';
import { IExpense, IExpenseSearch } from './expenses.interface';
import { Expense } from './expenses.model';
import { BankAccount } from '../BannkAccount.ts/bankAccount.model';
import { TransactionHistory } from '../TransactionHistory.ts/transactionHistory.model';
import { ExpensesSearchFields } from './expenses.conts';


const createExpense = async (payloads: IExpense[]): Promise<IExpense[]> => {
  if (!payloads || payloads.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No expenses provided');
  }

  const session: ClientSession = await mongoose.startSession();
  let transactionStarted = false;

  try {
    await session.startTransaction();
    transactionStarted = true;

    const createdExpenses: IExpense[] = [];
    
    for (const payload of payloads) {
      // Validate payload
      if (!payload.amount || payload.amount <= 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid expense amount');
      }

      // Clean the payload - convert empty string to null for bankAccount
      const cleanedPayload = {
        ...payload,
        bankAccount: typeof payload.bankAccount === 'string' && payload.bankAccount === "" ? null : payload.bankAccount
      };

      // 1. Create expense
      const [expense] = await Expense.create([cleanedPayload], { session });
      createdExpenses.push(expense);

      // 2. Handle bank account update only if it's a valid ObjectId
      if (payload.bankAccount && mongoose.isValidObjectId(payload.bankAccount)) {
        try {
          const bankAccountId = payload.bankAccount;
          const bankAccount = await BankAccount.findById(bankAccountId).session(session);
          
          if (!bankAccount) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');
          }

          // Subtract expense amount from balance
          bankAccount.balance += payload.amount;

          // Validate that balance doesn't go negative
         

          await bankAccount.save({ session });

          // Create transaction history record
          await TransactionHistory.create(
            [
              {
                bankAccount: bankAccount._id,
                type: 'deposit',
                amount: payload.amount,
                description: payload.description || `Expense: ${payload.category}`,
                date: payload.date || new Date(),
              },
            ],
            { session }
          );
        } catch (bankError) {
          if (bankError instanceof ApiError) {
            throw bankError;
          }
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to process bank account transaction'
          );
        }
      }
    }

    await session.commitTransaction();
    return createdExpenses;
  } catch (error) {
    if (transactionStarted) {
      await session.abortTransaction();
    }
    
    console.error('Expense creation error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error.ValidationError) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
    
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An error occurred while creating expenses'
    );
  } finally {
    await session.endSession();
  }
};

const getAllExpenses = async (
  filtering: IExpenseSearch
): Promise<IgenericResponse<IExpense[]>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filtering;

  const andConditions: any[] = [];

  // 🔍 Search term condition
  if (searchTerm) {
    andConditions.push({
      $or: ExpensesSearchFields.map(field => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // 📅 Date filtering - FIXED
  if (startDate && endDate) {
    // ✅ If both start & end dates given → date range
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    andConditions.push({ date: { $gte: start, $lte: end } });
    
  } 
  
  // if (!startDate && !endDate) {
  //   // Show today's data
  //   const today = new Date();
  //   const start = new Date(today);
  //   start.setHours(0, 0, 0, 0);
  //   const end = new Date(today);
  //   end.setHours(23, 59, 59, 999);
  //   andConditions.push({ date: { $gte: start, $lte: end } });
  // } 

  // 🎯 Other filters (category, bankAccount, etc.)
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      andConditions.push({ [key]: value });
    }
  });

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // 🏦 Execute query (no pagination, sorted by date DESC)
  const result = await Expense.find(whereCondition)
    .populate("bankAccount")
    .populate("category")
    .sort({ date: -1 })
    .lean();

  const total = await Expense.countDocuments(whereCondition);

  return {
    meta: { total },
    data: result,
  };
};


const getSingleExpense = async (id: string): Promise<IExpense> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid expense ID');
  }

  const result = await Expense.findById(id)
    .populate('bankAccount', 'name accountNumber balance'); // Include relevant bank account info

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }

  return result;
};

const updateExpense = async (id: string, payload: Partial<IExpense>): Promise<IExpense> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid expense ID');
  }

  const existingExpense = await Expense.findById(id);
  if (!existingExpense) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }

  // If amount is being updated and bank account exists, handle the balance adjustment
  if (payload.amount !== undefined && existingExpense.bankAccount) {
    const session: ClientSession = await mongoose.startSession();
    
    try {
      session.startTransaction();
      
      const bankAccount = await BankAccount.findById(existingExpense.bankAccount).session(session);
      if (!bankAccount) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Associated bank account not found');
      }
      
      // Calculate the difference and update bank balance
      const amountDifference = payload.amount - existingExpense.amount;
      bankAccount.balance -= amountDifference;
      
      if (bankAccount.balance < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient funds in bank account');
      }
      
      await bankAccount.save({ session });
      
      // Update the transaction history if needed
      if (amountDifference !== 0) {
        await TransactionHistory.findOneAndUpdate(
          { expense: existingExpense._id },
          { 
            $inc: { amount: amountDifference },
            ...(payload.description && { description: payload.description }),
            ...(payload.date && { date: payload.date })
          },
          { session }
        );
      }
      
      // Update the expense
      const updatedExpense = await Expense.findByIdAndUpdate(
        id, 
        payload, 
        { new: true, session }
      ).populate('bankAccount', 'name accountNumber');
      
      await session.commitTransaction();
      return updatedExpense as IExpense;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
  
  // Simple update without bank account changes
  const result = await Expense.findByIdAndUpdate(
    id, 
    payload, 
    { new: true }
  ).populate('bankAccount', 'name accountNumber');
  
  return result as IExpense;
};

const deleteExpense = async (id: string): Promise<IExpense> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid expense ID');
  }

  const session: ClientSession = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const expense = await Expense.findById(id).session(session);
    if (!expense) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
    }
    
    // If expense has a bank account, revert the balance change
    if (expense.bankAccount) {
      const bankAccount = await BankAccount.findById(expense.bankAccount).session(session);
      if (bankAccount) {
        bankAccount.balance += expense.amount;
        await bankAccount.save({ session });
        
        // Remove associated transaction history
        await TransactionHistory.deleteOne({ 
          expense: expense._id 
        }).session(session);
      }
    }
    
    // Delete the expense
    const deletedExpense = await Expense.findByIdAndDelete(id).session(session);
    
    await session.commitTransaction();
    return deletedExpense as IExpense;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

// Additional utility function to get expense statistics
const getExpenseStats = async (timeframe: 'week' | 'month' | 'year' = 'month') => {
  const now = new Date();
  let startDate: Date;
  
  switch (timeframe) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }
  
  const stats = await Expense.aggregate([
    {
      $match: {
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
  
  return stats;
};

export const ExpenseService = {
  createExpense,
  getAllExpenses
  // getAllExpenses,
  // getSingleExpense,
  // updateExpense,
  // deleteExpense,
  // getExpenseStats
};