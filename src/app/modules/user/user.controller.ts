import e, { RequestHandler } from 'express';
import { UserService } from './user.service';
import catchasync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { Iuser, Userfillterfield } from './user.interface';
import { cloudinaryDestroy } from '../../../halper/ImageUploadHelper';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { pagination } from '../../../conostans/pagination';

const creatuser: RequestHandler = catchasync(
  async (req: Request, res: Response) => {
    const user = req.body;
    const result = await UserService.createuser(user);

    sendResponse(res, {
      statusCode: 200,
      success: false,
      message: 'success  creat user',
      data: result,
    });
  }
);



const getSinglleuser = catchasync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
}
  const result = await UserService.getSinglleuser(id);

  sendResponse<Iuser>(res, {
    statusCode: 200,
    success: true,
    message: 'User Data ',
    data: result,
  });
});


const updateProfile = catchasync(async (req:Request,res:Response)=>{

  const {oldimage,Image} = req.body

  console.log(req.body)


  if(Image.mediaId === null){
    delete req.body.oldimage
  }
  else if(Image.mediaId && oldimage?.mediaId){
    if(oldimage?.mediaId !== Image?.mediaId){
      await cloudinaryDestroy(oldimage?.mediaId)
    }
  }
  else if (Image.mediaId){
    delete req.body.oldimage
  }
  const body = req.body;
  const {id}= req.params


  const result = await UserService.updateProfile(id,body);
  sendResponse<Iuser>(res,{ 
    statusCode:httpStatus.OK,
    success:true,
    message:"User  Update successfully",
    data:result

  })

})

const updaterole = catchasync(async (req:Request,res:Response)=>{
  const {email} = req.params
  const body = req.body;

  console.log(req.body)
  console.log(req.params)

  const result = await UserService.updaterole(email,body);
  sendResponse<Iuser>(res,{ 
    statusCode:httpStatus.OK,
    success:true,
    message:"User  Update successfully",
    data:result

  })

}
)

const getAllUsers = catchasync(async (req: Request, res: Response) => {
  const filltring = pick(req.query, Userfillterfield);
  const PaginationObject = pick(req.query, pagination);
  const result = await UserService.getAllUsers(
    filltring,
    PaginationObject
  );

  sendResponse<Iuser[]>(res, {
    statusCode: 200,
    success: true,
    message: 'all User data',
    meta: result.meta,
    data: result.data,
  });
});





export const UserController = {
  creatuser,
  getSinglleuser,
  updateProfile,
  updaterole,
  getAllUsers
};
