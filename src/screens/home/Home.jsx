import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { getData, getDocuments, getUser, signOutUser, updateDocument } from '../../config/firebase/FirebaseMathods'
import { Timestamp, addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../config/firebase/FirebaseConfig'
import {  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, } from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'


const Home = () => {
  const [inputVal, setInputVal] = useState('')
  const [addingTodo, setAddingTodo] = useState([])
  const [editingIndex, setEditingIndex] = useState(-1) // Track which item is being edited
  const [editInputVal, setEditInputVal] = useState('') // Track edited value
  const editInputRef = useRef(null); // Ref for the input field
  const [displayName , setDisplayName] = useState([])
  const [isLoading , setIsLoading] = useState(false)

  useEffect(() => {
    async function getAllData() {
      try {
        const todosFromFirestore = await getDocuments("todos");
        // Ensure each todo object has a docId
        const todosWithIds = todosFromFirestore.map(todo => ({ ...todo, docId: todo.id }));
        setAddingTodo(todosWithIds);
      } catch (error) {
        console.error("Error fetching todos:", error);
        // Handle error fetching todos
      }
    }
    getAllData();
  }, []);
  
  // console.log(addingTodo);
  async function addTodo(e) {
    e.preventDefault();
    if (inputVal === "") {
      Swal.fire({
        title: "Empty Input!",
        text: "Enter Text Please.",
        icon: "warning",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: "top-right"
      });
      return;
    }
  
    setIsLoading(true); // Set loading state
  
    let obj = {
      todo: inputVal,
      uid: auth.currentUser.uid,
      postDate: Timestamp.fromDate(new Date()),
      docId: ""
    };
  
    try {
      // Add new document to Firestore
      const docRef = await addDoc(collection(db, "todos"), obj);
      obj.docId = docRef.id;
  
      // Update state immediately with the new todo item at the beginning
      setAddingTodo([obj, ...addingTodo]);
  
      // Clear input field
      setInputVal("");
    } catch (error) {
      console.error("Error adding todo:", error);
      // Handle error if needed
    } finally {
      setIsLoading(false); // Clear loading state
    }
  }
  
  async function deleteTodo(index) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Check if index is valid
          if (index < 0 || index >= addingTodo.length) {
            console.error(`Invalid index ${index} for deleting todo.`);
            return;
          }
  
          const todoItem = addingTodo[index];
          if (!todoItem || !todoItem.docId) {
            console.error(`Invalid todo item or missing docId at index ${index}`);
            return;
          }
          const updatedTodos = addingTodo.filter((_, i) => i !== index);
          setAddingTodo(updatedTodos);

          Swal.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top-right"
          });
  
          const todoId = todoItem.docId;
  
          // Delete document from Firestore
          await deleteDoc(doc(db, "todos", todoId));
  
          // Update state to remove the deleted todo item
          
  
          
  
        } catch (error) {
          console.error("Error deleting todo:", error);
          // Handle error
        }
      }
    });
  }

  function startEditing(index) {
    setEditingIndex(index)
    setEditInputVal(addingTodo[index].todo)
    // Focus on the input field when editing starts
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }

  function cancelEditing() {
    setEditingIndex(-1)
    setEditInputVal('')
  }

  async function saveEditing(index) {
    if (editInputVal === "") {
      // Handle empty input case
      return;
    }
  
    const updatedTodos = [...addingTodo];
    updatedTodos[index].todo = editInputVal;
  
    // Update document in Firestore
    const todoId = updatedTodos[index].docId;
    const washingtonRef = doc(db, "todos", todoId);
    await updateDoc(washingtonRef, { todo: editInputVal });
  
    // Update state with the edited todo item
    setAddingTodo(updatedTodos);
    setEditingIndex(-1);
    setEditInputVal("");
  }

  useEffect(() => {
    // getData("users").then((res)=>{
    //   console.log(res);
    // }).catch((err)=>{
    //   console.log(err);
    // })

   async function getUserData() {
    if (auth.currentUser) {
      const a = await getUser(auth.currentUser.uid);
      const b = a.data();
      // setIsUser(b);
      console.log(b);
      setDisplayName(b)
      //  navigate("home")
   } else{
      //  navigate("/")
      console.log("user ni mil raha");
   }
    }

    getUserData()
  }, [])
  

  function logout() {
    signOutUser().then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    })
  }
  

  return (
    <>
      <nav className='flex justify-between bg-blue-100 p-3 items-center'>
        <h1 className='font-semibold text-blue-700'>Ah Todo</h1>
        
        {/* <button onClick={logout} className='bg-red-500 text-white font-semibold p-2 rounded-md text-sm hover:bg-red-600 transition-all'>Logout</button> */}
        
        <DropdownMenu>
          <DropdownMenuTrigger className='outline-none flex justify-center items-center gap-2 rounded-full'>
          <h1 className='font-semibold text-black'>{displayName.displayName ? displayName.displayName : <div class="text-center">
              <div role="status">
                  <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
              </div>
          </div>}</h1>
            <div className='h-8 w-8 overflow-hidden outline-none'>
              <img className='outline-none rounded-full shadow' src={displayName.file} alt="" />
            </div>
          
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={"/home/profile"}><DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem></Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer font-semibold text-red-500 " onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> 
      

      </nav>

      <div className='flex justify-center mt-8 w-full'>
      <form onSubmit={addTodo} className='flex justify-center items-center gap-4 w-full'>
          <input placeholder='Enter text' value={inputVal} onChange={(e) => setInputVal(e.target.value)} className='w-[60%] outline-none border border-gray-300 p-2 px-3 rounded-md font-semibold' type="text" />
          {isLoading ? (
            <button className='bg-gray-500 w-16 text-white font-semibold p-2 rounded-md  hover:bg-gray-600'>
            <div className="w-full flex justify-center">
              <svg className="animate-spin  h-5 w-5 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            </button>
          ) : (
            <button className='bg-gray-500 text-white font-semibold p-2 rounded-md text-sm hover:bg-gray-600 transition-all'>Add Task</button>
          )}
        </form>
      </div>

      <div>
        {addingTodo.length > 0 ? (
          addingTodo.map((item, index) => (
            <div key={index}>
              {editingIndex === index ? ( // If editing, show input for editing
                <div className='flex items-center gap-4 ml-4 mt-8'>
                  <input
                    ref={editInputRef} // Ref to focus on this input
                    value={editInputVal}
                    placeholder='Enter Updated Text'
                    onChange={(e) => setEditInputVal(e.target.value)}
                    className='outline-none border border-gray-300 p-2 px-3 rounded-md font-semibold max-[500px]:w-[50%]' 
                    type="text"
                  />
                  <button onClick={() => saveEditing(index)} className='bg-green-500 text-white font-semibold p-2 rounded-md text-sm hover:bg-green-600 transition-all'>Save</button>
                  <button onClick={cancelEditing} className='bg-gray-500 text-white font-semibold p-2 rounded-md text-sm hover:bg-gray-600 transition-all'>Cancel</button>
                </div>
              ) : ( // If not editing, show task item and edit/delete buttons
                <div className='flex items-center gap-4 ml-4 mt-8'>
                  <h2 className='font-semibold text-black'>{item.todo}</h2>
                  <button onClick={() => deleteTodo(index)} className='bg-red-500 text-white font-semibold p-2 rounded-md text-sm hover:bg-red-600 transition-all'>Delete</button>
                  <button onClick={() => startEditing(index)} className='bg-blue-500 text-white font-semibold p-2 rounded-md text-sm hover:bg-blue-600 transition-all'>Edit</button>
                </div>
              )}
              <hr className='my-3' />
            </div>
          ))
        ) : (
          <p className='text-center font-semibold text-2xl mt-8'>No Item!</p>
        )}

      
      </div>
    </>
  )
}

export default Home
