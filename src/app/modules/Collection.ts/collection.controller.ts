import { Request, Response } from "express";
import catchasync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { CollectionService } from "./collection.service";
import { ICollection } from "./collection.interface";
import { CollectionFilterFields } from "./collection.conts";








const createCollection = catchasync(async (req: Request, res: Response) => {
  const event = req.body;
  const result = await CollectionService.createCollection(event);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully created Collection',
    data: result,
  });
});

const getAllCollections = catchasync(async (req: Request, res: Response) => {
    console.log(req.query);

  const filtering = pick(req.query, CollectionFilterFields);
  const result = await CollectionService.getAllCollections(
    filtering
  );

  sendResponse<ICollection[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All Collection data',
    meta: result.meta,
    data: result.data,
  });
});


export const CollectionController = {
  createCollection,
  getAllCollections,
};
