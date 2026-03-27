import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private functions = inject(Functions);

  async scanCard(imageBase64: string, mediaType: string): Promise<any> {
    const scanCardFn = httpsCallable(this.functions, 'scanCard');
    
    try {
      const result: any = await scanCardFn({
        imageBase64,
        mediaType
      });
      
      return result.data;
    } catch (error) {
      console.error('Gemini Scan Error (via Firestore Functions):', error);
      throw error;
    }
  }
}
