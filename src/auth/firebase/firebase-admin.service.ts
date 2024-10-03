import * as admin from 'firebase-admin';
// import * as fbServiceAccountKey from '../../../config/fbServiceAccountKey.json';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseAdminService {
  // Uncomment this to work
  // constructor() {
  //   if (admin.apps.length === 0) {
  //     admin.initializeApp({
  //       credential: admin.credential.cert(
  //         fbServiceAccountKey as admin.ServiceAccount,
  //       ),
  //     });
  //   }
  // }

  getAuth() {
    return admin.auth();
  }

  async verifyIdToken(idToken: string) {
    return await this.getAuth().verifyIdToken(idToken);
  }

  async verifyFirebaseUid(firebaseUid: string): Promise<void> {
    try {
      // Fetch the user by UID from Firebase to ensure it's valid
      const user = await this.getAuth().getUser(firebaseUid);
      console.log('User found:', user); // Log the user data to verify
    } catch (error) {
      console.error('Error in Firebase UID verification:', error);
      if (error.code === 'auth/user-not-found') {
        throw new BadRequestException(
          'User not found with the given Firebase UID.',
        );
      }
      throw new BadRequestException('Invalid Firebase UID.');
    }
  }
}
