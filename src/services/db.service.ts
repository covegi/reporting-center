import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DbService {
    constructor(public firestore: Firestore) {}

    // Create a reference to a specific document in the Firestore collection
    getDocumentRef(firestore: Firestore, collectionPath: string, documentId: string) {
        return doc(this.firestore, collectionPath, documentId);
    }

    // Fetch Firestore document asynchronously based on document reference
    // async getDocumentData(docRef: any) {
    //     const docSnap = await docData(docRef);
    //     return docSnap;
    // }
    getDocumentData(docRef: any): Observable<any> {
        return docData(docRef).pipe(
            map(docSnap => {
                return docSnap;
            })
        );
    }

    // Update Firestore document data asynchronously
    updateDocument(docRef: any, data: any): Observable<void> {
        return from(updateDoc(docRef, data));
    }


    }
    // // Update Firestore document data asynchronously
    // async updateDocument(docRef: any, data: any) {
    //     await updateDoc(docRef, data);
    // }


