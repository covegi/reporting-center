import { Injectable, inject } from '@angular/core';

import { Firestore, collection, collectionData, doc, docData, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private methods = (collectionName: string) => {
    const firestore = inject(Firestore);
    return {
      /** Returns single record from database */
      get: (id: string) => docData(doc(firestore, collectionName, id)),
      /** Returns all records from database */
      // TODO: How to handle cases where we only want to return records for a specific user
      getAll: () =>  collectionData(collection(firestore, collectionName), { idField: "id"}),
      /** Updates existing record in database */
      update: (id: string) => (data: Partial<unknown>) => updateDoc(doc(firestore, collectionName, id), data),
      /** Deletes a single record from database */
      // TODO: Add delete functionality
      delete: (id: string) => {},
    }
  }

  /** Database methods for `User` object */
  get users() {
    return this.methods("users")
  }

  /** Database methods for `Report` object */
  get reports() {
    return this.methods("reports")
  }
}
