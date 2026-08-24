import {signInWithMagicLink} from "./auth.provider";

export async function signInUser(email: string) {
    await signInWithMagicLink(email);
}