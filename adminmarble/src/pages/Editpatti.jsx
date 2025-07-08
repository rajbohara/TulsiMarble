
import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'react-toastify'

function Pattidetails() {
  const navigate = useNavigate();
 const [additionalPatti, setAdditionalPatti] = useState([]);
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [image, setImage] = useState(false);

  const [selectedpatti, setSelectedpatti] = useState()
  const backendURL = 'http://localhost:3000';
  const [isedit, setIsedit] = useState(false);
  const { _id } = useParams();
  console.log(_id);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  async function handleAdditionals(event) {
    
    const formData = new FormData();
    for (let i = 0; i < additionalImages.length; i++) {
      formData.append('images', additionalImages[i]);
    }
    formData.append('additionalInfo', additionalInfo);
    try {
      const response = await axios.post(`${backendURL}/admin/addpattiimages/${_id}`, formData);
      if (response.data.success) {
         setAdditionalPatti(response.data.additionalPatti);
        toast.success(response.data.message);

      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error uploading images");
    }
  }

   const fetchadditional = async () => {
        const { data } = await axios.get(`${backendURL}/additionalinfo/${_id}`);

        if (data.success) {
        console.log("additional data fetched", data);
         setAdditionalPatti(data.additionalPatti);

        } else {
          toast.error(data.message);
        }
    }

  async function onSubmitHandler(event) {
    event.preventDefault();

    try {
       const formData = new FormData();
    
       

        formData.append('name', name)
        formData.append('size', size)
        formData.append('quantity', Number(quantity))
        formData.append('rate', rate)
        if(image){
          formData.append('image', image)
        }
        formData.forEach((value, key) => {
          console.log(`${key}:${value}`)
        });
        console.log("updating")
        const { data } = await axios.post(backendURL + `/admin/editpatti/${_id}`, formData)
        if (data.success) {
          console.log("hanji ho gaya edit")
          toast.success(data.message)
          setImage(false)
          setName('')
          setSize('')
          setQuantity('')
          setRate('')
          navigate('/Inventory')
        } else {
          toast.error(data.message || "Something went wrong")
        
      }
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error.response.data.message)

    }

  }

  const fetchselected = async () => {
    try {
      console.log("selected lara")
      const { data } = await axios.get(`${backendURL}/admin/selectedpatti/${_id}`);

      if (data.success) {
        setSelectedpatti(data.selectedpatti);
        setName(data.selectedpatti.name);
        setSize(data.selectedpatti.size);
        setQuantity(data.selectedpatti.quantity);
        setRate(data.selectedpatti.rate)

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching inventory.");
      console.error(error);
    }
  }

  const handledeleteinfo = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/admin/deleteadditionalinfo/${_id}`);
      if (data.success) {
        toast.success(data.message);
        setAdditionalPatti(null); // Clear the additional info after deletion
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error deleting additional info");
    }
  }
   const handledeletepatti = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/admin/deletepatti/${_id}`);
      if (data.success) {
        handledeleteinfo();
        setAdditionalPatti(null); // Clear the additional info after deletion
        toast.success("Patti deleted successfully");
        navigate('/Inventory');
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error deleting additional info");
    }
  }

  useEffect(() => {
    console.log("useeffect called")
    fetchselected();
     fetchadditional();
  }, []);


  console.log(selectedpatti);
  return (
    <div>
      {selectedpatti ? (
        <div className='relative w-96 text-center mx-auto my-14'>
           <span onClick={()=> handledeletepatti()} className='cursor-pointer hover:underline text-blue-800 absolute -right-10 top-5'>Delete</span>
          <form onSubmit={onSubmitHandler} action="">
            <label htmlFor="photoyaha" className={`${isedit ? '' : 'hidden'}`}>            
              <img
              className='w-11/12 h-5/6 p-5 mx-auto object-cover rounded-3xl'
              src={ image? URL.createObjectURL(image):  selectedpatti.image}
              alt=""
            />
            </label>
           <input type="file" id='photoyaha'  hidden onChange={ (e)=> setImage(e.target.files[0])} />
             <img
              className={`w-11/12 h-5/6 p-5 mx-auto object-cover rounded-3xl ${isedit ? 'hidden' : ''}`}
              src={ image? URL.createObjectURL(image):  selectedpatti.image}
              alt=""
            />

            <p className={`text-2xl text-blue-900 text-center  ${isedit ? 'hidden' : ''}`}>
              {selectedpatti.name}
            </p>
            <input onChange={(e) => setName(e.target.value)} className={`border border-black   text-2xl text-blue-900 text-center block mx-auto ${isedit ? '' : 'hidden'}`} type="text" name="" id="" value={name} />

            <p className={`text-blue-900 text-center ${isedit ? 'hidden' : ''}`}>Size : {selectedpatti.size}</p>
            <input onChange={(e) => setSize(e.target.value)} className={`border border-black mt-3  text-blue-900 text-center mx-auto block ${isedit ? '' : 'hidden'}`} type="text" name="Size" id="" value={size} />
           
           
            <p className={`text-blue-900 text-center ${isedit ? 'hidden' : ''}`}>Rate : {selectedpatti.rate}</p>
            <input onChange={(e) => setRate(e.target.value)} className={`border border-black mt-3  text-blue-900 text-center mx-auto block ${isedit ? '' : 'hidden'}`} type="text" name="" id="" value={rate} />

            <p className={`text-blue-900 text-center  ${isedit ? 'hidden' : ''}`}>Quantity Available : {selectedpatti.quantity}</p>
            <input onChange={(e) => setQuantity(e.target.value)} className={` border border-black mt-3 text-blue-900 text-center block mx-auto ${isedit ? '' : 'hidden'}`} type="text" name="" id="" value={quantity} />

            <button  type="button" onClick={() => setIsedit(!isedit)} className={` py-3 my-4 px-24 mx-auto bg-blue-900 text-xl text-white  ${isedit ? 'hidden' : ''}`}>
              Edit
            </button>
            <button type='submit' className={`py-3 my-4 px-24 mx-auto bg-blue-900 text-xl text-white  ${isedit ? '' : 'hidden'}`}>
              Save
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center mt-10 text-blue-900">Loading...</p>
      )}
      
    
 {additionalPatti ? (
  <div key={additionalPatti._id} className=" relative border p-4 rounded-lg shadow mb-6">
    <span onClick={()=> handledeleteinfo()} className='cursor-pointer hover:underline text-blue-800 absolute right-5 top-5'>Delete</span>
    <p><strong>Patti ID:</strong> {additionalPatti.pattid}</p>
   <strong>Info:</strong>
    <pre className='ml-10 text-left ' >{additionalPatti.additionalInfo?.split('\n').map((line, idx) => {
    const [key, ...rest] = line.split(':');
    if (!rest.length) return <span key={idx}>{line}<br /></span>; // no colon, print as-is
    return (
      <span key={idx}>
        <strong>{key.trim()}:</strong> {rest.join(':').trim()}<br />
      </span>
    );
  })}</pre>

    <div className="mt-6 flex flex-wrap  justify-center gap-4">
      {additionalPatti.images?.map((img, idx) => (
            <img key={idx} src={img}  className="gap-8 h-56 w-56 object-cover rounded-md" alt="" />
          ))}
    </div>
  </div>
): (  <div className='w-screen mx-auto my-14'>
        <h1 className='text-2xl text-center my-5 underline  text-blue-900'>Add More Images -</h1>
        <input className=' w-56 mx-auto block  text-center '
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => setAdditionalImages(e.target.files)}
  />
    <p className={`text-blue-900 my-5 underline  text-center`}>Additional Info : </p>
            <textarea  onChange={(e) => {
    setAdditionalInfo(e.target.value);
  }} className={`p-2 w-96 h-40 border border-black mt-3 text-blue-900 text-left block mx-auto`} name="" id="" value={additionalInfo} />
        <button onClick={handleAdditionals} className='bg-blue-900 text-white px-5 py-2 rounded-lg block mx-auto my-5'>Add Additional Information</button>
      </div>)
      }


    </div>
  );


}

export default Pattidetails
