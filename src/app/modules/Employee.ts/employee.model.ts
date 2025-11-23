import { Schema, model, Model } from 'mongoose';
import { EmployeeModel, IEmployee } from './employee.interface';



export const EmployeeSchema = new Schema<IEmployee, EmployeeModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Employee = model<IEmployee, EmployeeModel>('Employee', EmployeeSchema);
