import { useRef, useState, useEffect } from 'react'
// import './logo-uploading.css'

export default function LogoUploading() {
    const fileInputRef = useRef()  // HTMLInputElement
    const [image, setImage] = useState()   // File
    const [preview, setPreview] = useState()   // string

    useEffect(() => {
        if (image) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(image)
        } else {
            setPreview(null)
        }
    }, [image])

    return (
        <div className="mt-8 max-w-3xl mx-auto px-8">
            <form>
                { preview 
                ? (<img src={preview} style={{objectFit: 'cover'}} onClick={ () => {
                    setImage(null)
                    fileInputRef.current.value = null
                } } />)
                : (<button 
                    class="focus:outline-none text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg"
                    onClick={ (event) => {
                    event.preventDefault();
                    fileInputRef.current.click();
                    } }>Add Image</button>)
                }
                <input 
                    type="file" 
                    style={{ display: "none" }} 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={ (event) => {
                        const file = event.target.files[0]
                        if (file && file.type.startsWith("image")) {
                            setImage(file)
                        } else {
                            setImage(null)
                        }
                    }} 
                />
            </form>
        </div>
    )
}