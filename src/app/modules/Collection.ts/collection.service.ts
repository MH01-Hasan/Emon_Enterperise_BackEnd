import mongoose, { ClientSession } from 'mongoose';
import { ICollection, ICollectionSearch } from './collection.interface';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';
import { Collection } from './collection.model';
import { BankAccount } from '../BannkAccount.ts/bankAccount.model';
import { TransactionHistory } from '../TransactionHistory.ts/transactionHistory.model';
import { IgenericResponse } from '../../../interface/common';
import { CollectionSearchFields } from './collection.conts';
import { Expense } from '../Expness.ts/expenses.model';



const createCollection = async (payloads: ICollection[]): Promise<ICollection[]> => {
  if (!payloads || payloads.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No Collection provided');
  }

  const session: ClientSession = await mongoose.startSession();
  let transactionStarted = false;

  try {
    await session.startTransaction();
    transactionStarted = true;

    const createdCollections: ICollection[] = [];
    
    for (const payload of payloads) {
      // Validate payload
      if (!payload.amount || payload.amount <= 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Collection amount');
      }

      // Clean the payload - convert empty string to null for bankAccount
      const cleanedPayload = {
        ...payload,
        bankAccount: typeof payload.bankAccount === 'string' && payload.bankAccount === "" ? null : payload.bankAccount,
        employee: typeof payload.employee === 'string' && payload.employee === "" ? null : payload.employee
      };

      // 1. Create collection
      const [collection] = await Collection.create([cleanedPayload], { session });
      createdCollections.push(collection);

      // 2. Handle bank account update only if it's a valid ObjectId
      if (payload.bankAccount && mongoose.isValidObjectId(payload.bankAccount)) {
        try {
          const bankAccountId = payload.bankAccount;
          const bankAccount = await BankAccount.findById(bankAccountId).session(session);
          
          if (!bankAccount) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');
          }

          // Subtract expense amount from balance
          bankAccount.balance -= payload.amount;

       
         

          await bankAccount.save({ session });

          // Create transaction history record
          await TransactionHistory.create(
            [
              {
                bankAccount: bankAccount._id,
                type: 'withdrawal',
                amount: payload.amount,
                description: payload.description || `Collection: ${payload.category}`,
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
    return createdCollections;
  } catch (error) {
    if (transactionStarted) {
      await session.abortTransaction();
    }

    console.error('Collection creation error:', error);

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

const getAllCollections = async (
  filtering: ICollectionSearch
): Promise<IgenericResponse<ICollection[]>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filtering;

  const andConditions: any[] = [];

  // 🔍 Search term condition
  if (searchTerm) {
    andConditions.push({
      $or: CollectionSearchFields.map(field => ({
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
  


  // 🎯 Other filters (category, bankAccount, etc.)
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      andConditions.push({ [key]: value });
    }
  });

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // 🏦 Execute query (no pagination, sorted by date DESC)
  const result = await Collection.find(whereCondition)
    .populate("bankAccount")
    .populate("category")
    .populate("employee")
    .sort({ date: -1 })
    .lean();

  const total = await Collection.countDocuments(whereCondition);

  return {
    meta: { total },
    data: result,
  };
};


// const getSingleExpense = async (id: string): Promise<IExpense> => {
//   if (!Types.ObjectId.isValid(id)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid expense ID');
//   }

//   const result = await Expense.findById(id)
//     .populate('bankAccount', 'name accountNumber balance'); // Include relevant bank account info

//   if (!result) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
//   }

//   return result;
// };

// const updateExpense = async (id: string, payload: Partial<IExpense>): Promise<IExpense> => {
//   if (!Types.ObjectId.isValid(id)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid expense ID');
//   }

//   const existingExpense = await Expense.findById(id);
//   if (!existingExpense) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
//   }

//   // If amount is being updated and bank account exists, handle the balance adjustment
//   if (payload.amount !== undefined && existingExpense.bankAccount) {
//     const session: ClientSession = await mongoose.startSession();
    
//     try {
//       session.startTransaction();
      
//       const bankAccount = await BankAccount.findById(existingExpense.bankAccount).session(session);
//       if (!bankAccount) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Associated bank account not found');
//       }
      
//       // Calculate the difference and update bank balance
//       const amountDifference = payload.amount - existingExpense.amount;
//       bankAccount.balance -= amountDifference;
      
//       if (bankAccount.balance < 0) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient funds in bank account');
//       }
      
//       await bankAccount.save({ session });
      
//       // Update the transaction history if needed
//       if (amountDifference !== 0) {
//         await TransactionHistory.findOneAndUpdate(
//           { expense: existingExpense._id },
//           { 
//             $inc: { amount: amountDifference },
//             ...(payload.description && { description: payload.description }),
//             ...(payload.date && { date: payload.date })
//           },
//           { session }
//         );
//       }
      
//       // Update the expense
//       const updatedExpense = await Expense.findByIdAndUpdate(
//         id, 
//         payload, 
//         { new: true, session }
//       ).populate('bankAccount', 'name accountNumber');
      
//       await session.commitTransaction();
//       return updatedExpense as IExpense;
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       await session.endSession();
//     }
//   }
  
//   // Simple update without bank account changes
//   const result = await Expense.findByIdAndUpdate(
//     id, 
//     payload, 
//     { new: true }
//   ).populate('bankAccount', 'name accountNumber');
  
//   return result as IExpense;
// };

// const deleteExpense = async (id: string): Promise<IExpense> => {
//   if (!Types.ObjectId.isValid(id)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid expense ID');
//   }

//   const session: ClientSession = await mongoose.startSession();
  
//   try {
//     session.startTransaction();
    
//     const expense = await Expense.findById(id).session(session);
//     if (!expense) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
//     }
    
//     // If expense has a bank account, revert the balance change
//     if (expense.bankAccount) {
//       const bankAccount = await BankAccount.findById(expense.bankAccount).session(session);
//       if (bankAccount) {
//         bankAccount.balance += expense.amount;
//         await bankAccount.save({ session });
        
//         // Remove associated transaction history
//         await TransactionHistory.deleteOne({ 
//           expense: expense._id 
//         }).session(session);
//       }
//     }
    
//     // Delete the expense
//     const deletedExpense = await Expense.findByIdAndDelete(id).session(session);
    
//     await session.commitTransaction();
//     return deletedExpense as IExpense;
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     await session.endSession();
//   }
// };

// // Additional utility function to get expense statistics
// const getExpenseStats = async (timeframe: 'week' | 'month' | 'year' = 'month') => {
//   const now = new Date();
//   let startDate: Date;
  
//   switch (timeframe) {
//     case 'week':
//       startDate = new Date(now.setDate(now.getDate() - 7));
//       break;
//     case 'month':
//       startDate = new Date(now.setMonth(now.getMonth() - 1));
//       break;
//     case 'year':
//       startDate = new Date(now.setFullYear(now.getFullYear() - 1));
//       break;
//     default:
//       startDate = new Date(now.setMonth(now.getMonth() - 1));
//   }
  
//   const stats = await Expense.aggregate([
//     {
//       $match: {
//         date: { $gte: startDate }
//       }
//     },
//     {
//       $group: {
//         _id: '$category',
//         totalAmount: { $sum: '$amount' },
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $sort: { totalAmount: -1 }
//     }
//   ]);
  
//   return stats;
// };

export const CollectionService = {
  createCollection,
  getAllCollections,
  // getSingleCollection,
  // updateCollection,
  // deleteCollection,
  // getCollectionStats
};