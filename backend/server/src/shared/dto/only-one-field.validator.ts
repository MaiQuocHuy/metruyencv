import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'OnlyOneSortField', async: false })
export class OnlyOneFieldValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dto: any = args.object;
    const fields = args.constraints;
    const chosenFields = fields.filter((field) => dto[field]);
    return chosenFields.length <= 1;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Only one of updatedAt, createdAt, manga_views, or manga_number_of_followers can be set.';
  }
}
