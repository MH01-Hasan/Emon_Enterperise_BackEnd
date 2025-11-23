import { SortOrder } from "mongoose";
import { Pagination_helper } from "../../../halper/paginationhelper";
import { IgenericResponse } from "../../../interface/common";
import { IpaginationObject } from "../../../interface/pagination";
import { BankAccountSearchFields } from "./bankAccount.const";
import { IBankAccount, IBankAccountSearch } from "./bankAccount.interface";
import { BankAccount } from "./bankAccount.model";



const createBankAccount = async (payload: IBankAccount): Promise<IBankAccount> => {
    const account = new BankAccount(payload);
    await account.save();
    return account;
};

const getAllBankAccounts = async (
    filtering: IBankAccountSearch,
    PaginationObject: IpaginationObject
): Promise<IgenericResponse<IBankAccount[]>> => {
    const { searchTerm, ...filterData } = filtering;

    const andCondition = [];

    if (searchTerm) {
        andCondition.push({
            $or: BankAccountSearchFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    if (Object.keys(filterData).length) {
        andCondition.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const { page, limit, skip, sortBy, sortOrder } =
        Pagination_helper.calculatePagination(PaginationObject);

    const sortCondition: { [key: string]: SortOrder } = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }

    const findCondition = andCondition.length > 0 ? { $and: andCondition } : {};

    const result = await BankAccount.find(findCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = await BankAccount.countDocuments(findCondition);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};




export const BankAccountService = {
    createBankAccount,
    getAllBankAccounts,
};