import { NextFunction, Request, Response } from 'express';

const cleanExpenseData = (req: Request, res: Response, next: NextFunction) => {
  const cleanFields = (item: any) => {
    if (typeof item.bankAccount === 'string' && item.bankAccount.trim() === '') {
      item.bankAccount = null;
    }
    if (typeof item.employee === 'string' && item.employee.trim() === '') {
      item.employee = null;
    }
    return item;
  };

  if (Array.isArray(req.body)) {
    req.body = req.body.map(cleanFields);
  } else {
    req.body = cleanFields(req.body);
  }

  next();
};

export default cleanExpenseData;
