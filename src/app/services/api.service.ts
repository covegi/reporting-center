import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  Observable,
  firstValueFrom,
  forkJoin,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';

import { User } from '../interfaces/user.interface';
import { Report } from '../interfaces/report.interface';
import { Organization } from '../interfaces/organization.interface';
import { QuerySnapshot, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #firestore = inject(Firestore);
  #auth = inject(Auth);
  #user = signal<User | null>(null);
  #storage = getStorage();
  #http = inject(HttpClient);

  #firestoreMethods = <T>(collectionName: string) => {
    return {
      /** Returns single record from database */
      get: (id: string) =>
        firstValueFrom(
          docData(doc(this.#firestore, collectionName, id)),
        ) as Promise<T>,
      /** Returns all records from database */
      // TODO: How to handle cases where we only want to return records for a specific user
      getSelected: (org: string | null): Observable<any[]> => {
        return from(
          getDocs(
            query(
              collection(this.#firestore, 'reports'),
              where('organization', '==', org),
            ),
          ),
        ).pipe(
          map((querySnapshot: QuerySnapshot) => {
            return querySnapshot.docs.map((doc) => doc.data());
          }),
        );
      },

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
      /** Create a single record in database */
      create: (date?: string) =>
        addDoc(collection(this.#firestore, collectionName), { date }),
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

  get organizations() {
    return this.#firestoreMethods<Organization>('organizations');
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

  upload(files: FileList, reportId: string): Observable<string[]> {
    const fileListArray: File[] = Array.from(files);
    const uploadObservables: Observable<string>[] = fileListArray.map(
      (file) => {
        const filePath = `${file.name}`;
        const storageRef = ref(this.#storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Observable<string>((observer) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              console.error('Error uploading file: ', error);
              observer.error(error);
            },
            () => {
              observer.next('Upload successful');
              observer.complete();
              this.sendReportIdCloudFunctions(reportId);
            },
          );
        });
      },
    );

    return forkJoin(uploadObservables).pipe(
      switchMap(() => {
        return of(['Upload completed']);
      }),
    );
  }

  private sendReportIdCloudFunctions(reportId: string): void {
    const cloudFunctionUrl =
      'https://console.cloud.google.com/functions/details/us-central1/fileFirestoreCreate?env=gen1&authuser=0&hl=en&project=moxyid-f78c8';

    this.#http.post(cloudFunctionUrl, reportId);
  }
}
