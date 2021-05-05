import { useRef, useState, useEffect } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function LogoUploading() {
    const fileInputRef = useRef()  // HTMLInputElement
    const croppedImgRef = useRef()  // HTMLInputElement
    const [rotateAngle, setRotateAngle] = useState(0)  
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
        if (rotateAngle) {
            console.log(`rotate ${rotateAngle} degrees`)
            console.log(`rotate on ${imageRef}`)
            imageRef.style.transform = `rotate(${rotateAngle}deg)`
        }
    }, [image, rotateAngle])

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
        let canvas = document.createElement('canvas');
        // ctx.fillStyle = '#fff';
        let finalImgR = imageR;
        if (rotateAngle != 0) {
            canvas.width = imageR.width
            canvas.height = imageR.height
            const ctx = canvas.getContext('2d');
            // convert to degrees
            const toRotate = rotateAngle * Math.PI / 180;
            // find center point to rotate
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(toRotate);
            ctx.drawImage(imageR, -imageR.width/2, -imageR.height/2);
            ctx.rotate(-toRotate);
            ctx.translate(-canvas.width/2, -canvas.height/2);
            // get base64 encoded rotated image
            const rotatedImg = canvas.toDataURL('image/jpeg');
            // create new Image source to continue
            finalImgR = new Image();
            finalImgR.src = rotatedImg;
            canvas = document.createElement('canvas');
        }

        const scaleX = finalImgR.naturalWidth / finalImgR.width;
        const scaleY = finalImgR.naturalHeight / finalImgR.height;
        canvas.width = newCrop.width;
        canvas.height = newCrop.height; 
        const finalCtx = canvas.getContext('2d');

        finalCtx.drawImage(
          finalImgR,
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

    function sumbitCroppedImage(event) {
        event.preventDefault();
        fetch('/api/uploading', {
            method: 'POST'
            , mode: 'cors'
            , headers: {'Content-Type': 'application/json'}
            , body: JSON.stringify({data: croppedImg})
        })
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
                {preview && imageRef && (<>
                <button onClick={ (event) => {
                    event.preventDefault();
                    setRotateAngle( (rotateAngle + 90)%360 )
                }}>Rotate</button>
                <input type="number" value={rotateAngle} onChange={e => setRotateAngle(e.target.value % 360)}></input>
                </>)}
                { preview && croppedImg && (
                    <>
                    <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImg} ref={croppedImgRef} />
                    <button onClick={ (event) => sumbitCroppedImage(event)}>Submit</button>
                    </>
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