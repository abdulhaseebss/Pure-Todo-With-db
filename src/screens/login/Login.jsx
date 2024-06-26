import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, sendDataCustomUid } from '../../config/firebase/FirebaseMathods';
import { GithubAuthProvider, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const navigate = useNavigate();

  const obj = {
    email: email,
    password: password,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state on login button click

    loginUser(obj)
      .then((res) => {
        // console.log(res);
        navigate('home');
      })
      .catch((err) => {
        console.log(err);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Invalid user credential"
        });
      })
      .finally(() => {
        setIsLoading(false); // Clear loading state after login attempt (success or failure)
      });
  };

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  function googleSignin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        let obj = {
          displayName: user.displayName,
          email: user.email,
          file: user.photoURL,
          uid: user.uid,
        };

        sendDataCustomUid(obj, 'users')
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
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
      <section class="">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 light:bg-gray-100 light:border-black">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl light:text-black">
                Log in to your account
              </h1>
              <div class="space-y-4 md:space-y-6">
                <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      for="email"
                      class=" block mb-2 text-sm font-medium text-gray-900 light:text-white"
                    >
                      Your email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      name="email"
                      id="email"
                      class="outline-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="password"
                      class="block mb-2 text-sm font-medium text-gray-900 light:text-white"
                    >
                      Password
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      class="outline-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 light:bg-gray-700 light:border-gray-600 light:focus:ring-primary-600 light:ring-offset-gray-800"
                          required
                        />
                      </div>
                      <div class="ml-3 text-sm">
                        <label
                          for="remember"
                          class="text-gray-500 light:text-gray-300"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <Link to={"forgot"}>
                    <a class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-800">Forgot password?
                    </a>
                    </Link>
                      
                  </div>
                  <button
                    type="submit"
                    class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      'Log in'
                    )}
                  </button>
                </form>

                <div class="inline-flex items-center justify-center w-full">
                  <hr class="w-64 h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
                  <span class="absolute px-2 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 light:text-white light:bg-gray-900">
                    or
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={googleSignin}
                    class="w-full text-black border  bg-primary-600 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:hover:bg-gray-100 flex items-center justify-center gap-3"
                  >
                    <FcGoogle className="text-xl" /> Google
                  </button>
                  <button
                    onClick={githubSignin}
                    class="w-full text-black border  bg-primary-100 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:hover:bg-gray-100 flex items-center justify-center gap-3"
                  >
                    <FaGithub /> Github
                  </button>
                </div>

                <p class="text-sm font-light text-gray-500 light:text-gray-400">
                  Don’t have an account yet?{' '}
                  <Link to={'signup'}>
                    <a class="font-medium text-blue-600 hover:underline dark:text-blue-800">
                      Sign up
                    </a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
