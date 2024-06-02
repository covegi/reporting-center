import { Injectable, inject, signal } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  addDoc,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  listAll,
} from '@angular/fire/storage';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Observable, firstValueFrom, of, switchMap } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { Report } from '../interfaces/report.interface';
import { deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #firestore = inject(Firestore);
  #storage = inject(Storage);
  #auth = inject(Auth);
  #user = signal<User | null>(null);

  #firestoreMethods = <T>(collectionName: string) => {
    return {
      /** Returns single record from database */
      get: (id: string) =>
        docData(doc(this.#firestore, collectionName, id)) as Observable<T>,
      /** Returns all records from database */
      // TODO: How to handle cases where we only want to return records for a specific user
      getAll: () =>
        collectionData(collection(this.#firestore, collectionName), {
          idField: 'id',
        }) as Observable<Array<T>>,
      /** Create new records in database and return its id */
      create: (data: Partial<T> | Record<string, never> = {}) =>
        addDoc(
          collection(this.#firestore, collectionName),
          data as unknown as DocumentSnapshot,
        ).then((documentRef) => documentRef.id),
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

  #storageMethods = (collectionName: string) => {
    return {
      createFile: (id: string, file: File) => {
        uploadBytesResumable(
          ref(this.#storage, `${collectionName}/${id}/${file.name}`),
          file,
        );
      },
      deleteFile: (id: string) =>
        listAll(ref(this.#storage, `${collectionName}/${id}`)).then(
          (listResult) =>
            listResult.items.forEach((storageReference) =>
              deleteObject(storageReference),
            ),
        ),
    };
  };

  /** Database methods for `User` object */
  get users() {
    return this.#firestoreMethods<User>('users');
  }

  /** Database methods for `Report` object */
  get reports() {
    return {
      ...this.#firestoreMethods<Report>('reports'),
      ...this.#storageMethods('reports'),
    };
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
