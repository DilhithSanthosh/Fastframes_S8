import { auth, db, storage } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { addDoc, getDoc, collection } from 'firebase/firestore';
import { User, setUserData } from '../Models/User';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

// check authentication state
export const checkAuthState = (setUser) => {
    // setUser is a function that updates the user state in the parent component
    return auth.onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });
};

// remove firebase from error messages
const sanitizeErrorMessage = (message) => {
    message = message.toString();

    return message.replace("Firebase: ", "");
}

// authenticate user
export const authenticate = async (email, password) => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                resolve(userCredential.user);
            })
            .catch((error) => {
                error.message = sanitizeErrorMessage(error.message.toString());
                reject(error);
            });
    });
}

// signup with email
export const signUp = async (name, email, password) => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // add user data to firestore
                addDoc(collection(db, "users"), setUserData(name, email, password, userCredential.user.uid))
                    .then(() => {
                        resolve(userCredential.user);
                    })
                    .catch((error) => {
                        reject(error);
                    });
                resolve(userCredential.user);
            })
            .catch((error) => {
                error.message = sanitizeErrorMessage(error.message.toString());
                reject(error);
            });
    });
}

// logout
export const logout = async () => {
    return new Promise((resolve, reject) => {
        auth.signOut()
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                reject(false);
            });
    });
};

// validate email
export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

// success toast
export const successToast = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        transition: Bounce,
    });
};

// error toast
export const errorToast = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        transition: Bounce,
    });
};

// add data to firestore
export const addData = (collectionName, data) => {
    return new Promise((resolve, reject) => {
        addDoc(collection(db, collectionName), data)
            .then((docRef) => {
                resolve(docRef);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// generate verification token
export const generateVerificationToken = async (email) => {
    return new Promise((resolve, reject) => {
        auth.currentUser.getIdToken(true).then((idToken) => {
            resolve(idToken);
        }
        ).catch((error) => {
            reject(error);
        });
    });
}

// retrieve videos of the user from firebase cloud
export const retrieveVideos = async (uid) => {
    const listRef = ref(storage, `${uid}/`);
    const videos = [];
    try {
        const list = await listAll(listRef);
        list.prefixes.forEach((folderRef) => {
            const videoPair = [];
            listAll(folderRef).then((res) => {
                res.items.forEach(async (itemRef) => {
                    // create http link for the video from itemRef.fullPath
                    const url = await getDownloadURL(ref(storage, itemRef.fullPath));
                    videoPair.push(url);
                });
            });
            videos.push(videoPair);
        });
        return videos;
    } catch (error) {
        return [];
    }
}

// download video file from firebase storage
