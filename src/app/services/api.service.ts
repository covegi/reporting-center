import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  addDoc,
  DocumentSnapshot,
  query,
  where,
  collectionData,
  WhereFilterOp,
  FieldPath,
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
import { Observable, filter, of, switchMap } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { Report } from '../interfaces/report.interface';
import { deleteObject } from 'firebase/storage';
import { toSignal } from '@angular/core/rxjs-interop';

export type FilterCriteria = {
  fieldPath: string | FieldPath;
  opStr: WhereFilterOp;
  value: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #firestore = inject(Firestore);
  #storage = inject(Storage);
  #auth = inject(Auth);
  #userObservable = authState(this.#auth).pipe(
    switchMap((authState) =>
      authState ? this.users.get(authState.uid) : of(null),
    ),
  );
  #user = toSignal(this.#userObservable);

  #firestoreMethods = <T>(collectionName: string) => {
    return {
      /** Returns single record from database */
      get: (id: string) =>
        docData(doc(this.#firestore, collectionName, id), {
          idField: 'id',
        }) as Observable<T>,
      /** Returns all records from database */
      getAll: (filterCriteria?: FilterCriteria) =>
        this.#userObservable.pipe(
          filter((user) => user != null),
          switchMap((user) => {
            console.log(user);
            console.log(filterCriteria);
            const collectionRef = collection(this.#firestore, collectionName);
            if (user) {
              if (user.admin || !filterCriteria)
                return collectionData(collectionRef, {
                  idField: 'id',
                }) as Observable<Array<T>>;
              return collectionData(
                query(
                  collectionRef,
                  where(
                    filterCriteria.fieldPath,
                    filterCriteria.opStr,
                    filterCriteria.value,
                  ),
                ),
                { idField: 'id' },
              ) as Observable<Array<T>>;
            }
            return of([]);
          }),
        ),
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
      user: this.#user,
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
}
