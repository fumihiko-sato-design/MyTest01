/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Timestamp } from 'firebase/firestore';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile {
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}
