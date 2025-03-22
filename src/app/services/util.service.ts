import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private AESsecretKey = environment.AESsecretKey;

  constructor() { }

  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.AESsecretKey).toString();;
  }

  decrypt(encryptedData: string): string {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.AESsecretKey);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);;
  }

  generateTimeOptions(): string[] {
    const options = [];
    for (let h = 0; h <= 12; h++) { 
      for (let m = 0; m < 60; m += 15) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  }
}
