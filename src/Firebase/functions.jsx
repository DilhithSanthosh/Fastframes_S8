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
export const retrieveVideos = async (uid, setFunc) => {
    const listRef = ref(storage, `${uid}/`);
    const videos = [];

    try {
        const list = await listAll(listRef);

        // Using map to create an array of promises for each folder
        const folderPromises = list.prefixes.map(async (folderRef) => {
            const videoPair = [];
            const res = await listAll(folderRef);
            await Promise.all(res.items.map(async (itemRef) => {
                const url = await getDownloadURL(ref(storage, itemRef.fullPath));
                videoPair.push(url);
            }));
            videos.push(videoPair);
        });

        // Wait for all promises to resolve
        await Promise.all(folderPromises);

        return videos;
    } catch (error) {
        return [];
    }
}


// // download video file from firebase storage
// export const handleDownloadVideo = (video_link) => {
//     // Replace 'video.mp4' with the actual video file URL
//     const link = document.createElement('a');
//     link.style.display = 'none';

//     // Set the href attribute to the video URL
//     link.href = video_link;

//     // Set the download attribute and filename
//     link.setAttribute('download', 'video.mp4');

//     // Add the anchor element to the document body
//     document.body.appendChild(link);

//     // Trigger a click event on the anchor element
//     link.click();

//     // Clean up
//     document.body.removeChild(link);
// };

export const handleDownloadVideo = async (video_link) => {
    try {
        // Fetch the video file, enable cors in firebase storage
        const response = await fetch(video_link);
        const blob = await response.blob();

        // Create a Blob URL for the video blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', 'video.mp4');
        document.body.appendChild(link);
        // Programmatically click the anchor to trigger download
        link.click();

        // Cleanup: Remove the anchor and revoke the blob URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        successToast("Video downloaded!");
    } catch (error) {
        errorToast("Failed to download video");
        console.error('Error downloading video:', error);
    }
};