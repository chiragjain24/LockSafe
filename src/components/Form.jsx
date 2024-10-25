import React, { useState , memo , useImperativeHandle, forwardRef} from 'react'
import saveIcon from '../assets/save.png'

const Form = forwardRef( ( {addPassw,showPass} , ref) => {

    const [form, setForm] = useState({})

    useImperativeHandle(ref, () => ({
        editData: (data) => {
            setForm(data);
        },
        someFunction2:()=>{

        },
    }));

    function extractDomain(input) {
        const match = input.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+)/);
        return match ? match[1] : input;
    }

    
    const handleAdd = () => {
        if (form.url && form.username && form.password) {
            let url = form.url.trim();
            url=extractDomain(url);
            const username = form.username.trim();
            const password = form.password.trim();
            addPassw({url,username,password})
            setForm({})
        }
    }

      const handleChange = (e)=>{
        setForm({...form, [e.target.name] :e.target.value });
      }
    
  return (
    <>

            <input value={form.url?form.url:""} name='url' onChange={handleChange} className=' w-full px-3 py-1 rounded-xl border-2 border-green-300 ' type="text" placeholder='Enter Website URL' />

            <div className=' w-full text-center flex gap-5 justify-between flex-col sm:flex-row'>
                <input value={form.username?form.username:""} name='username' onChange={handleChange} className=' w-full sm:w-3/4  px-3 py-1 rounded-xl border-2 border-green-300' type="text" placeholder='Enter Username' />
                <input value={form.password?form.password:""} name='password' onChange={handleChange}  className=' w-full sm:w-1/4 px-3 py-1 rounded-xl border-2 border-green-300' type={showPass ? "text" : "password"} placeholder='Enter Password' />
            </div>

            <button onClick={handleAdd} className='bg-green-400 rounded-2xl px-5 py-2 text-base flex items-center gap-2 text-black hover:bg-green-500'>
                <img src={saveIcon} className='w-6' alt="" />
                <span>Save</span>
            </button>
    </>
  )
});

export default memo(Form)
