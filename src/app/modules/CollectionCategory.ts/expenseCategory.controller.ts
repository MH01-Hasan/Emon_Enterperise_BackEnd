import { Request, Response } from 'express';
import catchasync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { pagination } from '../../../conostans/pagination';
import { CollectionCategoryService } from './collectionCategory.service';
import { CollectionCategoryFilterFields } from './collectionCategory.conts';
import { ICollectionCategory } from './expenseCategory.interface';

// ..........................Create CollectionCategory.............................................
const createCollectionCategory = catchasync(async (req: Request, res: Response) => {
  const event = req.body;
  const result = await CollectionCategoryService.createCollectionCategory(event);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully created CollectionCategory',
    data: result,
  });
});

const getAllCollectionCategories = catchasync(async (req: Request, res: Response) => {
  const filtering = pick(req.query, CollectionCategoryFilterFields);
  const PaginationObject = pick(req.query, pagination);
  const result = await CollectionCategoryService.getAllCollectionCategories(
    filtering,
    PaginationObject
  );

  sendResponse<ICollectionCategory[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All CollectionCategory data',
    meta: result.meta,
    data: result.data,
  });
});

// ..........................Get single CollectionCategory.............................................
const getSingleCollectionCategory = catchasync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }
  const result = await CollectionCategoryService.getSingleCollectionCategory(id);

  sendResponse<ICollectionCategory>(res, {
    statusCode: 200,
    success: true,
    message: 'CollectionCategory Data',
    data: result,
  });
});

// ..........................Update CollectionCategory.............................................
const updateCollectionCategory = catchasync(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const updatedata = req.body;

  console.log(id, updatedata);

  const result = await CollectionCategoryService.updateCollectionCategory(id, updatedata);
  sendResponse<ICollectionCategory>(res, {
    statusCode: 200,
    success: true,
    message: 'CollectionCategory Data Successfully Updated',
    data: result,
  });
});

// ...........................Delete CollectionCategory.............................................
const deleteCollectionCategory = catchasync(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const result = await CollectionCategoryService.deleteCollectionCategory(id);
  sendResponse<ICollectionCategory>(res, {
    statusCode: 200,
    success: true,
    message: 'Deleted CollectionCategory Data Successfully',
    data: result,
  });
});

export const CollectionCategoryController = {
  createCollectionCategory,
  getAllCollectionCategories,
  getSingleCollectionCategory,
  updateCollectionCategory,
  deleteCollectionCategory,
};
