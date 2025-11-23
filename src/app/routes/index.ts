import express from 'express';
import { UserRoutes } from '../modules/user/user.router';
import { AuthRoutes } from '../modules/auth/auth.router';
import { EmployeeRoutes } from '../modules/Employee.ts/employee.router';
import { ExpenseCategoryRoutes } from '../modules/ExpenseCategory.ts/expenseCategory.router';
import { BankAccountRoutes } from '../modules/BannkAccount.ts/bankAccount.router';
import { ExpenseRoutes } from '../modules/Expness.ts/expenses.router';
import { CollectionCategoryRoutes } from '../modules/CollectionCategory.ts/expenseCategory.router';
import { CollectionRoutes } from '../modules/Collection.ts/collection.router';



const router = express.Router();

const apiroutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/employee',
    route: EmployeeRoutes,
  },
  {
    path: '/expensecategory',
    route: ExpenseCategoryRoutes,
  },
  {
    path: '/bankaccount',
    route: BankAccountRoutes,
  },

  {
    path: '/expenses',
    route: ExpenseRoutes,
  },
  {
    path: '/collectioncategory',
    route: CollectionCategoryRoutes,
  }
,
  {
    path: '/collection',
    route: CollectionRoutes,
  }


 

];

apiroutes.forEach(route => router.use(route.path, route.route));

export default router;
