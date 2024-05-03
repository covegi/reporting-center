import { auth } from 'firebase-functions';
import { firestore } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as logger from 'firebase-functions/logger';

initializeApp();

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
