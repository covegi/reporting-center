import { Injectable, inject, signal } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { firstValueFrom, of, switchMap } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { Report } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #firestore = inject(Firestore);
  #auth = inject(Auth);
  #user = signal<User | null>(null);

  #firestoreMethods = <T>(collectionName: string) => {
    return {
      /** Returns single record from database */
      get: (id: string) =>
        firstValueFrom(
          docData(doc(this.#firestore, collectionName, id)),
        ) as Promise<T>,
      /** Returns all records from database */
      // TODO: How to handle cases where we only want to return records for a specific user
      getAll: () =>
        firstValueFrom(
          collectionData(collection(this.#firestore, collectionName), {
            idField: 'id',
          }),
        ) as Promise<Array<T>>,
      /** Updates existing record in database */
      update: (id: string, data: Partial<T>) =>
        updateDoc(doc(this.#firestore, collectionName, id), data),
      /** Deletes a single record from database */
      delete: (id: string) =>
        deleteDoc(doc(this.#firestore, collectionName, id)),
    };
  };

  #authMethods = () => {
    return {
      /** Signs in user using email and password */
      signin: (email: string, password: string) =>
        signInWithEmailAndPassword(this.#auth, email, password),
      /** Signs up user using email and password */
      signup: (email: string, password: string) =>
        createUserWithEmailAndPassword(this.#auth, email, password),
      /** Signs out user */
      signout: () => signOut(this.#auth),
      /** Stream of auth state changes as the user signs in our signs out */
      user: this.#user.asReadonly(),
    };
  };

  /** Database methods for `User` object */
  get users() {
    return this.#firestoreMethods<User>('users');
  }

  /** Database methods for `Report` object */
  get reports() {
    return this.#firestoreMethods<Report>('reports');
  }

  /** Methods for handling user authentication */
  get auth() {
    return this.#authMethods();
  }

  constructor() {
    authState(this.#auth)
      .pipe(
        switchMap((authState) =>
          authState ? this.users.get(authState.uid) : of(null),
        ),
      )
      .subscribe(this.#user.set);
  }
}
