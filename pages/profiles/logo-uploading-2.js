import { useRef, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function LogoUploading() {
    // const fileInputRef = useRef()  // HTMLInputElement
    const [rotateAngle, setRotateAngle] = useState(0)  
    const [image, setImage] = useState()   // File
    const [imageRef, setImageRef] = useState()   // HTMLImageElement
    const [croppedImg, setCroppedImg] = useState()   // Image URL??
    const [originRef, setOriginRef] = useState()   // HTMLImageElement
    // const [fileUrl, setFileUrl] = useState()   // Image URL??
    const [preview, setPreview] = useState()   // string
    const [rotatedPreview, setRotatedPreview] = useState()   // string
    // const [crop, setCrop] = useState({aspect: 16 / 9})   // string
    const [crop, setCrop] = useState({unit: 'px', x: 120, y : 200, width: 200, height: 200})   // string
    const {getRootProps, getInputProps} = useDropzone({
       accept: 'image/*',
       maxFiles: 1, 
       onDrop: acceptedFiles => {
           if (acceptedFiles.length == 1 && acceptedFiles[0] && acceptedFiles[0].type.startsWith("image")) {
                setImage(acceptedFiles[0])
           }
       }
    });

    useEffect(() => {
        if (!originRef) {
            console.log("set original image ref: ", imageRef)
            setOriginRef(imageRef)
        }
    }, [imageRef])

    useEffect(() => {
        if (image) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(image)
        } else {
            setOriginRef(null)
            setPreview(null)
            setRotateAngle(0)
            setRotatedPreview(null)
        }
        if (imageRef) {
            console.log(`rotate ${rotateAngle} degrees`)
            // console.log(`rotate on ${imageRef}`)
            // imageRef.style.transform = `rotate(${rotateAngle}deg)`
            // makeClientCrop(crop)
        }
    }, [image])

    useEffect(() => {
        console.log(`rotated to ${rotateAngle} degrees`)
        if (originRef) {
            rotating()
        }
    }, [rotateAngle])

    function makeClientCrop(newCrop) {
        if (imageRef && newCrop.width && newCrop.height) {
            const croppedImage = getCroppedImg(
                imageRef,
                newCrop,
                'newCrop.jpeg'
            );
            // console.log(`cropped images: ${croppedImage}`);
            if (croppedImage) {
                setCroppedImg(croppedImage);
            }
        }
    }

    function rotating() {
            let canvas = document.createElement('canvas'); 
            canvas.width = imageRef.width
            canvas.height = imageRef.height
            const ctx = canvas.getContext('2d');
            // convert to degrees
            // const toRotate = rotateAngle * Math.PI / 180;
            const toRotate = Math.PI / 2;
            console.log(`v4. canvas width=${canvas.width} height=${canvas.height} rotate=${rotateAngle} toRotate=${toRotate}`)
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(toRotate);
            ctx.drawImage(imageRef, -imageRef.width/2, -imageRef.height/2);
            ctx.rotate(-toRotate);
            ctx.translate(-canvas.width/2, -canvas.height/2);
            // get base64 encoded rotated image
            const rotatedImg = canvas.toDataURL('image/jpeg');
            setPreview(rotatedImg);
            setRotatedPreview(rotatedImg);
    }

    function getCroppedImg(imageR, newCrop, fileName) {
        let canvas = document.createElement('canvas');
        // ctx.fillStyle = '#fff';
        return doCrop(imageR, canvas, newCrop)
      }

    function doCrop(finalImgR, canvas, newCrop) {
        console.log(`final image: nw=(${finalImgR.naturalWidth},nh=${finalImgR.naturalHeight},w=${finalImgR.width},h=${finalImgR.height})`)
        let scaleX = finalImgR.naturalWidth / finalImgR.width
        let scaleY = finalImgR.naturalHeight / finalImgR.height
        console.log(`scale (${scaleX}, ${scaleY})`)
        if (scaleX == 0 || Number.isNaN(scaleX) || scaleY == 0 || Number.isNaN(scaleY)) {
            return null;
        }
        canvas.width = newCrop.width
        canvas.height = newCrop.height
        const finalCtx = canvas.getContext('2d')
        console.log(`crop=(${newCrop.x},${newCrop.y},${newCrop.width},${newCrop.height})`)

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
        )

        const base64Img = canvas.toDataURL('image/jpeg')
        return base64Img
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
                { preview 
                ?   ( <ReactCrop src={preview} crop={crop} 
                    ruleOfThirds 
                    onImageLoaded={newImg => { setImageRef(newImg) } }
                    onComplete={newCrop => makeClientCrop(newCrop)}
                    onChange={(newCrop, percentCrop) => setCrop(newCrop) }
                /> 
                )
                : (
                    <section className='drop-container'>
                        <div {...getRootProps({className: 'dropzone'})} style={{display: 'flex', 'flexDirection': 'column', width: '100%', 'justifyContent': 'center', 'alignItems': 'center', height: '480px', border: 'dotted 1px'}}>
                            <input {...getInputProps()} />
                            <div style={{className:'my-6'}}>Drag a profile photo here</div>
                            <div style={{className:'my-6'}}>-- or --</div>
                            <div style={{className: 'my-6', border: 'solid 1px', padding: '2px'}}>Select a photo from your computer</div>
                        </div>
                    </section>
                    )
                }
                {preview && imageRef && (<>
                <button onClick={ (event) => {
                    event.preventDefault();
                    // setRotateAngle(90);
                    setRotateAngle( (rotateAngle + 90)%360 );
                }}>Rotate</button>{' '}
                {/* <input type="number" value={rotateAngle} onChange={e => setRotateAngle(e.target.value % 360)}></input> */}
                </>)}
                { preview && croppedImg && (
                    <>
                    <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImg} />
                    <button onClick={ (event) => sumbitCroppedImage(event)}>Submit</button>{' '}
                    <button className='border-2 border-purple-500 hover:border-gray-500' onClick={ (event) => setImage(null)}>
                            Re-Select
                    </button>
                    </>
                  )}
                <div />
                { rotatedPreview && (
                           <>
                           <div>
                               <div className="text-center text-2xl border-2 border-indigo-600">Canvas Rotated Image Output</div>
                               <img alt="rotatedImagePreview" style={{ maxWidth: '100%' }} src={rotatedPreview} />
                           </div>
                           </>
                  )}
        </div>
    )
}