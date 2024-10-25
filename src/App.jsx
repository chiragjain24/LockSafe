import React, { useEffect, useState , useRef , useCallback} from 'react'

import editIcon from './assets/editIcon.png'
import deleteIcon from './assets/deleteIcon.png'
import { v4 as uuidv4 } from 'uuid';
import Form from './components/Form';
import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_ENCRYPTION_KEY);
const iv = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_ENCRYPTION_IV);

function encrypt(text) {
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  return encrypted;
}

function decrypt(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}


const App = () => {

  const [passw, setPassw] = useState([{
    id: uuidv4(),
    url:" ",
    username:" ",
    password:" ",
  }]);
  
  const [showPass, setShowPass] = useState(false);
  const componentRef=useRef();

  const handleShowPass = ()=>{
    setShowPass((prevShowPass)=>{
      return !prevShowPass;
    })
  }
  const fetchData =async ()=>{

    try{
      let data= await JSON.parse( localStorage.getItem("pass11")) ;
      data.map((item)=>{
        item.id=decrypt(item.id);
        item.url=decrypt(item.url);
        item.username=decrypt(item.username);
        item.password=decrypt(item.password);
      })
  
      if(data && data.length>0){
        setPassw(data);
      }
      else{
        setPassw([{
          id: uuidv4(),
          url:"demo.com",
          username:"demo123",
          password:"12345678",
        }])
      }
    }
    catch(error){
      setPassw([{
        id: uuidv4(),
        url:"demo.com",
        username:"demo123",
        password:"12345678",
      }])
    }

  }


  const storeData =(newPassw)=>{

    const enc=newPassw.map( (element) => {
      return {
        id:encrypt(element.id),
        url: encrypt(element.url),
        username: encrypt(element.username),
        password: encrypt(element.password),
      };
    });

    localStorage.setItem("pass11",JSON.stringify(enc));

  }  
  

  useEffect(() => {
    fetchData();

  }, [])



  const addPassw = useCallback( (item)=>{
    setPassw((prevPassw)=>{
      let newPassw=[...prevPassw, {
        id: uuidv4(),
        url: item.url,
        username: item.username,
        password: item.password,
      }];
      storeData(newPassw);
      return newPassw;
    });
    
  }, [] )
  
  


  const handleEdit = (e) => { 
    let uuid = e.target.name;
    let item = passw.find((item) => item.id === uuid);

    componentRef.current.editData({ url:item.url, username:item.username, password:item.password})
    let newPassw = passw.filter((item) => {
      return item.id != uuid
    })

    setPassw(newPassw)
    storeData(newPassw);

  }

  const handleDelete = async (e) => {
    let x=confirm('Are you sure you want to delete?')
    if(!x) return;
    let uuid = e.target.name;
    let newPassw = passw.filter((item) => {
      return item.id != uuid
    })
    setPassw(newPassw)
    storeData(newPassw);
  }




  return (
    <>
      <div className='bg-green-50 min-h-screen py-10 '>

        <div className='w-full sm:w-2/3 flex flex-col items-center gap-5 mx-auto px-2'>
          <div className='text-center'>
            <h2 className='font-bold text-green-600 text-3xl'>&lt;<span className='text-black '>Lock</span>Safe/&gt;</h2>
            <p>Your own Password Manager</p>
          </div>

          
          <Form showPass={showPass} addPassw={addPassw} ref={componentRef} />


          <div className='w-full'>
            <div className='flex  items-center justify-between'>
              <h2 className='font-bold text-xl my-5'>Your Passwords </h2>
              <div className='text-lg flex gap-3 '>
                <input onChange={ ()=>handleShowPass() } type="checkbox" id="showInp" checked={showPass}/>
                <label htmlFor="showInp" className='hover:cursor-pointer'> Show Passwords?</label>
              </div>
            </div>

            {passw.length === 0 && <p>No Passwords to display</p>}

            {passw.length != 0 &&
              <div className='w-full overflow-x-auto'>
              <table className='w-full border-2 border-black text-center'>

                <thead>
                  <tr className='bg-green-800 text-white'>
                    <th className='w-1/2 py-1'>Site</th>
                    <th className='w-1/4'>Username</th>
                    <th className='w-1/6'>Password</th>
                    <th className='w-1/12'>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {passw.map((item) => {
                    return (
                      <tr key={item.id} className='bg-green-100'>
                        <td className='py-2'>{item.url}</td>
                        <td>{item.username}</td>
                        <td> {showPass ? item.password : "******"}</td>
                        <td>
                          <div className='flex justify-center gap-3'>
                            <img name={item.id} onClick={handleEdit} src={editIcon} className='w-5 hover:cursor-pointer' alt="" />
                            <img name={item.id} onClick={handleDelete} src={deleteIcon} className='w-5 hover:cursor-pointer' alt="" />
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                </tbody>
              </table>
              </div>
            }


          </div>




        </div>
      </div>
    </>
  )
}

export default App
