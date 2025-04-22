// firebaseAuthService.ts
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import app from "../Firbase/firebaseConfig"; // Verify the path and folder name are correct

const auth = getAuth(app);

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

/**
 * Signs up a new user using Firebase Authentication.
 * @param email - The user's email.
 * @param password - The user's password.
 * @param displayName - (Optional) The display name for the user.
 * @returns The signed-up user.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // Update the displayName in Firebase user profile
  await updateProfile(user, { displayName });
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

/**
 * Signs in an existing user using Firebase Authentication.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns The signed-in user.
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Signs out the currently authenticated user.
 */
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
  localStorage.removeItem("user"); // Clear local user data

};

/**
 * Attaches an authentication state observer and returns an unsubscribe function.
 * The observer is called whenever the user's sign-in state changes.
 * @param callback - A function that receives the current user (or null if signed out).
 * @returns A function to unsubscribe from the auth state changes.
 */
export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
