import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
import datetime

class Firebase:
    auth = None
    db = None
    app = None
    bucket = None

    @staticmethod
    def init():
        '''Intialize the Firebase app and get the auth and db instances.'''
        cred = credentials.Certificate("fb_key.json")
        Firebase.app = firebase_admin.initialize_app(cred,{
            'storageBucket': 'fast-4886e.appspot.com'
        })

        Firebase.auth = auth
        Firebase.db = firestore.client()
        Firebase.bucket = storage.bucket()

    def verify_init(func):
        '''Verify that the Firebase app has been initialized.'''
        def wrapper(*args, **kwargs):
            if Firebase.app is None:
                Firebase.init()
            return func(*args, **kwargs)
        return wrapper

    @staticmethod
    @verify_init
    def get_user(uid):
        '''Get the user with the given uid.'''
        return Firebase.auth.get_user(uid)
    
    @staticmethod
    @verify_init
    def get_user_details(uid):
        '''Get the user details with the given uid.'''
        return Firebase.db.collection("users").document(uid).get().to_dict()

    @staticmethod
    @verify_init
    def verify_token(token):
        '''Verify the given token.'''
        decoded_token = Firebase.auth.verify_id_token(token)
        return decoded_token
        
    @staticmethod
    @verify_init
    def get_doc(collection, doc):
        '''Get the document from the given collection.'''
        return Firebase.db.collection(collection).document(doc).get().to_dict()
    
    @staticmethod
    @verify_init
    def get_collection(collection):
        '''Get all the documents from the given collection.'''
        return Firebase.db.collection(collection).stream()
    
    @staticmethod
    @verify_init
    def add_doc(collection, doc):
        '''Add the given document to the collection.'''
        Firebase.db.collection(collection).add(doc)


    @staticmethod
    @verify_init
    def set_doc(collection, doc_id, doc):
        '''Set the given document to the collection.'''
        Firebase.db.collection(collection).document(doc_id).set(doc, merge=True)

    @staticmethod
    @verify_init
    def upload_file(file, filename):
        '''Upload the given file to the Firebase storage.'''
        blob = Firebase.bucket.blob(filename)
        blob.upload_from_filename(file)
        return blob.generate_signed_url(expiration=datetime.timedelta(minutes=10), method='GET')
    

    @staticmethod
    @verify_init
    def get_next_filename():
        '''Get the next filename to be used for the uploaded file.'''
        return Firebase.db.collection("files").document("count").get().to_dict()["count"]