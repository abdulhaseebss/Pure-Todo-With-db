import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { addImageToStorage, sendDataCustomUid, signUpUser, updateDocument } from '../../config/firebase/FirebaseMathods';
import { GithubAuthProvider, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state on signup button click

        addImageToStorage(file, email).then((res) => {
            let obj = {
                displayName: name,
                email: email,
                password: password,
                file: res
            };
            let newObj = {
                password: ""
            };

            signUpUser(obj).then((res) => {
                updateDocument(newObj, res, "users").then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
                navigate('/');
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoading(false); // Clear loading state after signup attempt (success or failure)
            });
        }).catch((err) => {
            console.log(err);
            setIsLoading(false); // Clear loading state on error
        });
    };

    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    function googleSignin() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                let obj = {
                    displayName: user.displayName,
                    email: user.email,
                    file: user.photoURL,
                    uid: user.uid
                };

                sendDataCustomUid(obj, "users").then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    const githubProvider = new GithubAuthProvider();
    function githubSignin() {
        signInWithPopup(auth, githubProvider)
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;

                let obj = {
                    displayName: user.displayName,
                    email: user.email,
                    file: user.photoURL,
                    uid: user.uid
                };

                sendDataCustomUid(obj, "users").then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
                // console.log(user);
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                // ...
            });
    }

return (
        <>
            <section className="mt-20 mb-20">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 light:bg-gray-100 light:border-black">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl light:text-black">
                                Create account
                            </h1>
                            <div className="space-y-4 md:space-y-6">
                                <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>


                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Your Name</label>
                                        <input value={name} onChange={(e) => setName(e.target.value)} type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500 outline-none" placeholder="john doe" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Your email</label>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500 outline-none" placeholder="name@company.com" required />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Password</label>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500 outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 light:text-white" htmlFor="file_input">Upload file</label>
                                        <input accept='image/*' onChange={(e) => setFile(e.target.files[0])} className="block w-full text-sm text-gray-800 border-gray-300 bg-gray-50 border rounded-lg file:py-3 file:h-full file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-800 " id="file_input" type="file" />
                                    </div>
                                    {/* <div className="flex items-center justify-between">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 light:bg-gray-700 light:border-gray-600 light:focus:ring-primary-600 light:ring-offset-gray-800" required="" />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="remember" className="text-gray-500 light:text-gray-300">Remember me</label>
                                            </div>
                                        </div>
                                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-blue-800">htmlForgot password?</a>
                                    </div> */}
                                    <button type="submit" className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {isLoading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            'Create an account'
                                        )}
                                    </button>
                                </form>

                                <div className="inline-flex items-center justify-center w-full">
                                    <hr className="w-64 h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
                                    <span className="absolute px-2 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 light:text-white light:bg-gray-900">or</span>
                                </div>

                                <div className='flex gap-3'>
                                    <button onClick={googleSignin} className="w-full text-black border  bg-primary-600 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:hover:bg-gray-100 flex items-center justify-center gap-3"><FcGoogle className='text-xl' /> Google</button>
                                    <button onClick={githubSignin} className="w-full text-black border  bg-primary-600 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:hover:bg-gray-100 flex items-center justify-center gap-3"><FaGithub /> Github</button>
                                </div>

                                <p className="text-sm font-light text-gray-500 light:text-gray-400">
                                    Already have an account? <Link to={"/"}><a className="font-medium text-blue-600 hover:underline dark:text-blue-800">Log here</a></Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Signup;
