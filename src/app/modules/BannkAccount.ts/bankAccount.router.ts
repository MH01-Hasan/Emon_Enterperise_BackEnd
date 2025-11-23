import express from 'express';
import { BankAccountController } from './bankAccount.controller';
// import { BankAccountController } from '../BankAccount/bankAccount.controller';

const router = express.Router();

router.post(
    '/',
//   validateRequest(BankAccountValidation.CreateBankAccountZodSchema),
    BankAccountController.createBankAccount
);
router.get(
    '/',
//   validateRequest(BankAccountValidation.CreateBankAccountZodSchema),
    BankAccountController.getAllBankAccounts
);


export const BankAccountRoutes = router;
