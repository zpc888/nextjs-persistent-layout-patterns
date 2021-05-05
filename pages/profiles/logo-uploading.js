import { useRef, useState, useEffect } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function LogoUploading() {
    const fileInputRef = useRef()  // HTMLInputElement
    const [image, setImage] = useState()   // File
    const [imageRef, setImageRef] = useState()   // HTMLImageElement
    const [croppedImg, setCroppedImg] = useState()   // Image URL??
    // const [fileUrl, setFileUrl] = useState()   // Image URL??
    const [preview, setPreview] = useState()   // string
    // const [crop, setCrop] = useState({aspect: 16 / 9})   // string
    const [crop, setCrop] = useState({unit: 'px', x: 120, y : 200, width: 200, height: 200})   // string

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

    function makeClientCrop(newCrop) {
        if (imageRef && newCrop.width && newCrop.height) {
            const croppedImage = getCroppedImg(
                imageRef,
                newCrop,
                'newCrop.jpeg'
            );
            console.log(`cropped images: ${croppedImage}`);
            setCroppedImg(croppedImage);
        }
    }

    function getCroppedImg(imageR, newCrop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = imageR.naturalWidth / imageR.width;
        const scaleY = imageR.naturalHeight / imageR.height;
        canvas.width = newCrop.width;
        canvas.height = newCrop.height;
        const ctx = canvas.getContext('2d');
        // ctx.fillStyle = '#fff';
    
        ctx.drawImage(
          imageR,
          newCrop.x * scaleX,
          newCrop.y * scaleY,
          newCrop.width * scaleX,
          newCrop.height * scaleY,
          0,
          0,
          newCrop.width,
          newCrop.height
        );
        
        const base64Img = canvas.toDataURL('image/jpeg');
        return base64Img;
        // return new Promise((resolve, reject) => {
        //   canvas.toBlob(blob => {
        //     if (!blob) {
        //       //reject(new Error('Canvas is empty'));
        //       console.error('Canvas is empty');
        //       return;
        //     }
        //     blob.name = fileName;
        //     // window.URL.revokeObjectURL(fileUrl);
        //     // setFileUrl(window.URL.createObjectURL(blob));
        //     // resolve(fileUrl);
        //     resolve(blob);
        //   }, 'image/jpeg');
        // });
      }

    return (
        <div className="mt-8 max-w-3xl mx-auto px-8">
            <form>
                { preview 
                ?   ( <ReactCrop src={preview} crop={crop} 
                    ruleOfThirds 
                    onImageLoaded={newImg => setImageRef(newImg)}
                    onComplete={newCrop => makeClientCrop(newCrop)}
                    onChange={(newCrop, percentCrop) => setCrop(newCrop) }
                /> 
                )
                // ? (<img src={preview} style={{objectFit: 'cover'}} onClick={ () => {
                //     setImage(null)
                //     fileInputRef.current.value = null
                // } } />)
                : (<button 
                    className="focus:outline-none text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg"
                    onClick={ (event) => {
                    event.preventDefault();
                    fileInputRef.current.click();
                    } }>Add Image</button>)
                }
                { preview && croppedImg && (
                    <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImg} />
                    // <Image alt="Crop" style={{ maxWidth: '100%' }} src={croppedImg} layout='fill' />
                  )}
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