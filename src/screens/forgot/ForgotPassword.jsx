import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(email);

        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            // ..
            console.log("Password reset email sent!");

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
                icon: "success",
                title: "Password reset email sent!"
              });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error);
            // ..
        });
    }

    

  return (
    <>
    <section className="">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 light:bg-gray-100 light:border-black">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl light:text-black">
                        Forgot Password
                    </h1>
                    <div className="space-y-4 md:space-y-6">
                        <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Your Email</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500 outline-none" placeholder="name@company.com" required />
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
                            <button type="submit" className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700`}>Send Mail</button>
                        </form>

                        <div className="inline-flex items-center justify-center w-full">
                            <hr className="w-64 h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
                            <span className="absolute px-2 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 light:text-white light:bg-gray-900">or</span>
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
  )
}

export default ForgotPassword