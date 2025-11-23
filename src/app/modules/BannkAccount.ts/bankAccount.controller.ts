
import { Request, Response } from 'express';
import catchasync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BankAccountService } from "./bankAccount.service";
import { IBankAccount } from './bankAccount.interface';



const createBankAccount = catchasync(async (req: Request, res: Response) => {
  const event = req.body;
  console.log(event);
  const result = await BankAccountService.createBankAccount(event);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully created Bank Account',
    data: result,
  });
});

const getAllBankAccounts = catchasync(async (req: Request, res: Response) => {
  console.log(req.query);
    const filtering = req.query;
    const PaginationObject = req.query; 
    const result = await BankAccountService.getAllBankAccounts(filtering as any, PaginationObject as any);
      console.log(result);

    sendResponse<IBankAccount[]>(res, {
        statusCode: 200,
        success: true,
        message: 'Successfully retrieved all Bank Accounts',
        meta: result.meta,
        data: result.data,
    });
});



export const BankAccountController = {
  createBankAccount,
  getAllBankAccounts,

};


