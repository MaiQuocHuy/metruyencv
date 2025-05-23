import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import _, { entries } from 'lodash';
@Injectable()
export default class Util {
  generateIdByTime({
    fitWithInteger,
  }: {
    fitWithInteger?: boolean;
  } = {}): number {
    fitWithInteger = fitWithInteger ?? false;
    const date = Date.now();
    let id = parseInt(date.toString(), 10);

    if (fitWithInteger) id = id % 1_000_000_000;
    return id;
  }

  generateSlug(elements: Array<string>, option: object = {}): string {
    const text = elements.join(' ');
    return slugify(text, option);
  }

  formatStackTrace(stack: string | any): string[] | string {
    if (typeof stack === 'string') {
      return stack.split('\n').map((line) => line.trim());
    }
    return stack;
  }

  getInfoData({ fields, object }: { fields: any[]; object: any }): object {
    return _.pick(object, fields);
  }

  static getAllDataOfEnum(enumObj: any) {
    const entries = Object.entries(enumObj);
    return entries.map(([key, value], index) => {
      const isLastEle = index === entries.length - 1;
      return `${isLastEle ? value : value + ', '}`;
    });
  }

  replaceDataObjectByKey(data: { objReplace: any; objWillBeReplace: any }): {
    updatedObject: any;
    changes: { field: string; oldValue: any; newValue: any }[];
  } {
    const { objReplace, objWillBeReplace } = data;
    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    Object.entries(objReplace).forEach(([key, value]) => {
      if (
        value !== undefined &&
        objWillBeReplace[key] != undefined &&
        objWillBeReplace[key] !== value
      ) {
        changes.push({
          field: key,
          oldValue: objWillBeReplace[key],
          newValue: value,
        });
        objWillBeReplace[key] = value; // Only replace keys with new values
      }
    });
    // Object.entries(objReplace).forEach(([key, value]) => {
    //   if (value !== undefined) {
    //     objWillBeReplace[key] = value; // Only replace keys with new values
    //   }
    // });
    return { updatedObject: objWillBeReplace, changes };
  }
}
