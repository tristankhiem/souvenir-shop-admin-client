import {Injectable} from '@angular/core';

declare var moment: any;
declare var slugify: any;

@Injectable({
  providedIn: 'root'
})
export class AppCommon {
  private digit = [' không ', ' một ', ' hai ', ' ba ', ' bốn ', ' năm ', ' sáu ', ' bảy ', ' tám ', ' chín '];
  private moneyUnit = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];

  public isReg(pattern, val): boolean {
    const reg = new RegExp(pattern);
    return reg.test(val);
  }

  public getTimeStampFromDate(val: string, format?: string): string {
    const formatF = format ? format : 'YYYY-MM-DD';
    return moment(val, formatF).valueOf();
  }

  public getTimeStampFromDateTime(val: string, format?: string): string {
    const formatF = format ? format : 'YYYY-MM-DD HH:mm:ss';
    return moment(val, formatF).valueOf();
  }

  public toSlug(text: string): string {
    return slugify(text, {
      replacement: '-',  // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true,      // convert to lower case, defaults to `false`
      strict: false,     // strip special characters except replacement, defaults to `false`
      locale: 'vi'       // language code of the locale to use
    });
  }

  private threeDigitNumberToString(threeDigitNumber): string {
    let hundred;
    let dozen;
    let unit;
    let result = '';
    hundred = parseInt(String(threeDigitNumber / 100), 10);
    dozen = parseInt(String((threeDigitNumber % 100) / 10), 10);
    unit = threeDigitNumber % 10;
    if (hundred === 0 && dozen === 0 && unit === 0) { return ''; }
    if (hundred !== 0) {
      result += this.digit[hundred] + ' trăm ';
      if ((dozen === 0) && (unit !== 0)) { result += ' linh '; }
    }
    if ((dozen !== 0) && (dozen !== 1)) {
      result += this.digit[dozen] + ' mươi';
      if ((dozen === 0) && (unit !== 0)) { result = result + ' linh '; }
    }
    if (dozen === 1) { result += ' mười '; }
    switch (unit) {
      case 1:
        if ((dozen !== 0) && (dozen !== 1)) {
          result += ' mốt ';
        }
        else {
          result += this.digit[unit];
        }
        break;
      case 5:
        if (dozen === 0) {
          result += this.digit[unit];
        }
        else {
          result += ' lăm ';
        }
        break;
      default:
        if (unit !== 0) {
          result += this.digit[unit];
        }
        break;
    }
    return result;
  }
  public moneyToString(amount): string {
    let times = 0;
    let i = 0;
    let num = 0;
    let result = '';
    let tmp = '';
    let isNegativeNumber = false;
    const position = [];
    if (amount < 0) { isNegativeNumber = true; }// return "Số tiền âm !";
    if (amount === 0) { return 'Không đồng'; }// "Không đồng !";
    if (amount > 0) {
      num = amount;
    }
    else {
      num = -amount;
    }
    if (amount > 8999999999999999) {
      // amount = 0;
      return ''; // "Số quá lớn!";
    }
    position[5] = Math.floor(num / 1000000000000000);
    if (isNaN(position[5])) {
      position[5] = '0';
    }
    num = num - parseFloat(position[5].toString()) * 1000000000000000;
    position[4] = Math.floor(num / 1000000000000);
    if (isNaN(position[4])) {
      position[4] = '0';
    }
    num = num - parseFloat(position[4].toString()) * 1000000000000;
    position[3] = Math.floor(num / 1000000000);
    if (isNaN(position[3])) {
      position[3] = '0';
    }
    num = num - parseFloat(position[3].toString()) * 1000000000;
    position[2] = parseInt(String(num / 1000000), 10);
    if (isNaN(position[2])) {
      position[2] = '0';
    }
    position[1] = parseInt(String((num % 1000000) / 1000), 10);
    if (isNaN(position[1])) {
      position[1] = '0';
    }
    position[0] = parseInt(String(num % 1000), 10);
    if (isNaN(position[0])) {
      position[0] = '0';
    }
    if (position[5] > 0) {
      times = 5;
    }
    else if (position[4] > 0) {
      times = 4;
    }
    else if (position[3] > 0) {
      times = 3;
    }
    else if (position[2] > 0) {
      times = 2;
    }
    else if (position[1] > 0) {
      times = 1;
    }
    else {
      times = 0;
    }
    for (i = times; i >= 0; i--) {
      tmp = this.threeDigitNumberToString(position[i]);
      result += tmp;
      if (position[i] > 0) { result += this.moneyUnit[i]; }
      if ((i > 0) && (tmp.length > 0)) { result += ''; }// ',';//&& (!string.IsNullOrEmpty(tmp))
    }
    if (result.substring(result.length - 1) === ',') {
      result = result.substring(0, result.length - 1);
    }
    result = result.substring(1, 2).toUpperCase() + result.substring(2);
    result = result.replace(/\s\s+/g, ' ');
    if (isNegativeNumber) {
      return 'Âm ' + result + ' đồng'; // .substring(0, 1);//.toUpperCase();// + result.substring(1);
    }
    else {
      return result + ' đồng'; // .substring(0, 1);//.toUpperCase();// + result.substring(1);
    }
  }

}
