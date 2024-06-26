import { auth } from '@/config/firebase/FirebaseConfig'
import { addImageToStorage, getUser, updateDocument } from '@/config/firebase/FirebaseMathods'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Profile = () => {
    const [isUser, setIsUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [file, setFile] = useState(null); // State to hold the selected file

    useEffect(() => {
        async function getUserData() {
            if (auth.currentUser) {
                const userData = await getUser(auth.currentUser.uid);
                const userDataObj = userData.data();
                setIsUser(userDataObj);
                setName(userDataObj.displayName || '');
                setEmail(userDataObj.email || '');
            } else {
                console.log("User not found");
            }
        }

        getUserData();
    }, []);

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        // Handle the selected file (e.g., upload to Firebase storage)
        console.log("Selected file:", selectedFile);
        setFile(selectedFile); // Set the selected file to state
        // Assuming you have the URL of the uploaded image or blob URL, set it to profileImage state
        const imageURL = URL.createObjectURL(selectedFile);
        setProfileImage(imageURL);
    }

    function handleDeletePicture() {
        // Clear the profile image state when deleting the picture
        setProfileImage('');
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Log only the file to the console

        // Check if the current name and email match the default loaded values
        if (name === (isUser ? isUser.displayName : "") && email === (isUser ? isUser.email : "")) {
            alert("Everything is up to date!");
        } else {
            // Perform your save logic here
            // console.log("Save logic:", email, name , file);

            


            addImageToStorage(file, email).then((res) => {
                const obj = {
                    displayName: name,
                    email: email,
                    file: res
                }
                updateDocument(obj, auth.currentUser.uid, "users").then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err)=>{
                console.log(err);
            })
            
            // Optionally, you can update the user data in Firebase here
        }
    }

  return (
    <>
        <div class="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931] justify-center">
    
    <main class="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div class="p-2 md:p-4">
            <div class="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                <h2 class="pl-6 text-2xl font-bold sm:text-xl flex items-center gap-3 ml-[-30px]"><Link to={'/home'}><button className='bg-blue-600 text-white text-sm font-semibold p-1 px-3 rounded-md'>Back</button></Link> Your Profile</h2>

                <div class="grid max-w-2xl mx-auto mt-8">
                    <div class="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">

                    <img className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                      src={profileImage || (isUser ? isUser.file : "")}
                      alt="Profile Picture"/>

                        <div class="flex flex-col space-y-5 sm:ml-8">
                        <label htmlFor="fileInput" className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-blue-700 rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 cursor-pointer" >
                                Change picture
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    accept='image/*'
                                    onChange={handleFileChange} />
                        </label>
                            <button type="button" onClick={handleDeletePicture}
                                class="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 ">
                                Delete picture
                            </button>
                        </div>
                    </div>

                    <div class="items-center mt-8 sm:mt-14 text-[#202142]">
                    <form onSubmit={handleSubmit}>
                        <div
                            class="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                            <div class="w-full">
                                <label for="first_name"
                                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your
                                    Name</label>
                                <input type="text" id="first_name"
                                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                    placeholder="Your Name" onChange={(e) => setName(e.target.value)} value={name || ''} required/>
                            </div>

                            {/* <div class="w-full">
                                <label for="last_name"
                                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your
                                    last name</label>
                                <input type="text" id="last_name"
                                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                    placeholder="Your last name" value="Ferguson" required/>
                            </div> */}

                            </div>

                            <div class="mb-2 sm:mb-6">
                                <label for="email"
                                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your
                                    Email</label>
                                <input type="email" id="email"
                                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                    defaultValue={isUser ? isUser.email : ""} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@mail.com" required/>
                            </div>

                            <div class="flex justify-end">
                                <button type="submit"
                                    class="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
    </>
  )
}

export default Profile