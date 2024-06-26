import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import app, { storage } from "./FirebaseConfig.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    setDoc,
    orderBy,
  } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  
  const auth = getAuth(app);
  
  //initialize firestore database
  const db = getFirestore(app);
  
  // register user
  
  let signUpUser = (obj) => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, obj.email, obj.password)
        .then(async (res) => {
          resolve((obj.uid = res.user.uid));
          await setDoc(doc(db, "users", res.user.uid), obj)
            .then((res) => {
              console.log("user added to database successfully");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  };
  
  // login user
  let loginUser = (obj) => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, obj.email, obj.password)
        .then(async () => {
          const q = query(
            collection(db, "users"),
            where("uid", "==", auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            resolve(doc.data());
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  
  //signout User
  const signOutUser = () => {
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          resolve("user Signout Successfully");
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  //send data to firestore
  const sendData = (obj, colName) => {
    return new Promise((resolve, reject) => {
      addDoc(collection(db, colName), obj)
        .then((res) => {
          resolve("data send to db successfully");
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  export const sendDataCustomUid = (obj, colName) => {
    return new Promise((resolve, reject) => {
      setDoc(doc(db, colName , auth.currentUser.uid), obj)
        .then((res) => {
          resolve("data send to db successfully");
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  
  
  //get data with id from firestore
  const getData = (colName) => {
    return new Promise(async (resolve, reject) => {
      const dataArr = []
      const q = query(
        collection(db, colName),
        where("id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataArr.push(doc.data())
    });
      resolve(dataArr);
      reject("error occured" );
    });
  };

  export async function getUser(id) {
    const docSnap = await getDoc(doc(db, "users", id));
    return docSnap
  }
  
  export async function setDocument(id , obj) {
    const setDocs = await setDoc(doc(db, "users", id), obj);
    return setDocs
  }


  export async function getDocuments(colName) {
    const q = query(collection(db, colName), orderBy('postDate', 'desc'), where("uid", "==", auth.currentUser.uid));
    let arr = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => { arr.push({ id: doc.id, ...doc.data()}) });
    return arr
    
  }

  // export async function getJobs() {
  //   const docs = await getDocs(query(collection(db, "jobs"), orderBy("createdAt", "desc")));
  //   let jobs = [];
  //   docs.forEach((doc) => { jobs.push({ id: doc.id, ...doc.data()}) });
  //   return jobs;
  // }


  //get all data
  const getAllData = (colName) => {
    return new Promise(async (resolve, reject) => {
      const dataArr = []
      const querySnapshot = await getDocs(collection(db, colName));
      querySnapshot.forEach((doc) => {
        const obj = { ...doc.data(), documentId: doc.id }
        dataArr.push(obj)
        resolve(dataArr);
      });
      reject("error occured")
    })
  }
  
  //Delete document by id
  const deleteDocument = async (id, name) => {
    return new Promise((resolve, reject) => {
      deleteDoc(doc(db, name, id));
      resolve("document deleted")
      reject("error occured")
    })
  }
  
  //update document by id
  const updateDocument = async (obj, id, name) => {
    return new Promise((resolve, reject) => {
      const update = doc(db, name, id);
      updateDoc(update, obj)
      resolve("document updated")
      reject("error occured")
    })
  }

    // const files = profile.files[0]
    const addImageToStorage = (files , email)=>{
      return new Promise((resolve , reject)=>{
        const storageRef = ref(storage, email);
        uploadBytes(storageRef, files).then(() => {
            getDownloadURL(storageRef).then((url) => {
                // console.log(url);
                resolve(url);
                reject('Error found');
            });
        });
      })
    }
  
  
  export { auth, db, signUpUser, loginUser, signOutUser, sendData, getData, getAllData, deleteDocument, updateDocument, addImageToStorage };