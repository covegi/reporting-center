import { auth } from 'firebase-functions';
import { firestore, storage, setGlobalOptions } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

import { getAuth } from 'firebase-admin/auth';
import * as logger from 'firebase-functions/logger';

initializeApp();
setGlobalOptions({ region: 'europe-west3' });

/**
 * When a file is uploaded to Storage we will add the file information like its name and public URL to
 * a corresponding record of the collection (folder where file is uploaded) in Firestore
 */
export const onFileCreate = storage.onObjectFinalized(async (event) => {
  const [collection, documentId, name] = event.data.name.split('/');

  logger.debug(`file created on ${event.data.name}`);
  if (!['reports', 'users', 'organizations'].includes(collection))
    throw Error(
      `The collection ${collection} is invalid. It should be reports, users or organizations.`,
    );

  await getFirestore()
    .collection(collection)
    .doc(documentId)
    .get()
    .then(async (documentSnapshot) => {
      if (!documentSnapshot.exists)
        throw Error(
          `The document ${collection}/${documentId} does not exist in database`,
        );

      logger.debug(`generate public path for file`);
      // TODO: This still gives some error:
      // <Error>
      //   <Code>AccessDenied</Code>
      //   <Message>Access denied.</Message>
      //   <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object. Permission 'storage.objects.get' denied on resource (or it may not exist).</Details>
      // </Error>
      const url = getStorage().bucket().file(event.data.name).publicUrl();
      logger.log(`public url was generated`, url);

      logger.debug(`add file information to database`);

      return documentSnapshot.ref
        .update({
          file: { name, url },
        })
        .then(() => logger.info(`file information was added to database`))
        .catch((error) => {
          logger.error(
            `could not add file information for ${collection}/${documentId} because of an unknown exception`,
            error,
          );
        });
    });
});

/**
 * When a file is deleted from Storage we will remove the file information like its name and public URL to
 * the corresponding record of the collection (folder where file is uploaded) in Firestore
 */
export const onDeleteFile = storage.onObjectDeleted(async (event) => {
  const [collection, documentId] = event.data.name.split('/');

  logger.debug(`file deleted on ${event.data.name}`);
  if (!['reports', 'users', 'organizations'].includes(collection))
    throw Error(
      `The collection ${collection} is invalid. It should be reports, users or organizations.`,
    );

  await getFirestore()
    .collection(collection)
    .doc(documentId)
    .get()
    .then(async (documentSnapshot) => {
      if (!documentSnapshot.exists)
        throw Error(
          `The document ${collection}/${documentId} does not exist in database`,
        );

      logger.debug(`delete file information from database`);

      return documentSnapshot.ref
        .update({
          file: null,
        })
        .then(() => logger.info(`file information was deleted from database`))
        .catch((error) => {
          logger.error(
            `could not delete file information for ${collection}/${documentId} because of an unknown exception`,
            error,
          );
        });
    });
});

/**
 * When a user is created in Firebase Auth we will create a user with the same ID in Firestore
 */
export const onUserCreate = auth.user().onCreate(async (user) => {
  logger.debug(`user created for ${user.email}`);

  logger.debug(`set role to user`);
  await getAuth()
    .setCustomUserClaims(user.uid, { isUser: true })
    .then(() => logger.log(`role was set to user`))
    .catch((error) => logger.error(`could not set role to user`, error));

  logger.debug(`create record in firestore`);
  await getFirestore()
    .collection('users')
    .doc(user.uid)
    .create({ email: user.email, role: 'user' })
    .then((writeResult) => logger.log(`user created in firestore`, writeResult))
    .catch((error) =>
      logger.error(`could not create user in firestore`, error),
    );
});

/**
 * When a user role has been changed by an admin in Firestore we update the claims for that user in Firebase Auth
 */
export const onUserRoleChange = firestore.onDocumentUpdated(
  'users/{userId}',
  async (snapshot) => {
    const after = snapshot.data!.after.data();
    const before = snapshot.data!.before.data();

    // Only change claims when the role has actually changed
    if (before.role !== after.role) {
      logger.debug(`change role for ${after.email} to ${after.role}`);
      let customClaims = {};
      switch (after.role) {
        case 'user':
          customClaims = { isUser: true };
          break;
        case 'super-user':
          customClaims = { isSuperUser: true };
          break;
        case 'admin':
          customClaims = { isAdmin: true };
          break;
      }
      logger.debug(`update user claims in firebase auth`, customClaims);
      await getAuth()
        .setCustomUserClaims(snapshot.params.userId, customClaims)
        .then(() => logger.log(`role was changed`))
        .catch((error) => logger.error(`role could not be changed`, error));
    } else {
      logger.debug(`the user was updated but not the role field, do nothing`);
    }
  },
);
