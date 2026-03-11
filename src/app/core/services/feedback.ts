import { Injectable, inject } from '@angular/core';
import { 
  Firestore, collection, addDoc, collectionData, 
  query, orderBy, doc, updateDoc, deleteDoc 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserFeedback {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  category: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: any;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private firestore = inject(Firestore);

  submitFeedback(feedback: Omit<UserFeedback, 'id' | 'status' | 'createdAt'>): Promise<any> {
    const ref = collection(this.firestore, 'user_feedbacks');
    return addDoc(ref, {
      ...feedback,
      status: 'pending',
      createdAt: new Date()
    });
  }

  getFeedbacks(): Observable<UserFeedback[]> {
    const ref = collection(this.firestore, 'user_feedbacks');
    const q = query(ref, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<UserFeedback[]>;
  }

  updateStatus(feedbackId: string, status: UserFeedback['status']): Promise<void> {
    const ref = doc(this.firestore, 'user_feedbacks', feedbackId);
    return updateDoc(ref, { status });
  }

  deleteFeedback(feedbackId: string): Promise<void> {
    const ref = doc(this.firestore, 'user_feedbacks', feedbackId);
    return deleteDoc(ref);
  }
}
