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

/**
 * Signs up a new user using Firebase Authentication.
 * @param email - The user's email.
 * @param password - The user's password.
 * @param displayName - (Optional) The display name for the user.
 * @returns The signed-up user.
 */
export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
};

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
