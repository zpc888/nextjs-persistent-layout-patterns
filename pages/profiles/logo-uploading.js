import { useRef, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function LogoUploading() {
    // const fileInputRef = useRef()  // HTMLInputElement
    const croppedImgRef = useRef()  // HTMLInputElement
    const [rotateAngle, setRotateAngle] = useState(0)  
    const [image, setImage] = useState()   // File
    const [imageRef, setImageRef] = useState()   // HTMLImageElement
    const [croppedImg, setCroppedImg] = useState()   // Image URL??
    // const [fileUrl, setFileUrl] = useState()   // Image URL??
    const [preview, setPreview] = useState()   // string
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
        if (image) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(image)
        } else {
            setPreview(null)
        }
        if (imageRef) {
            console.log(`rotate ${rotateAngle} degrees`)
            // console.log(`rotate on ${imageRef}`)
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
            // console.log(`cropped images: ${croppedImage}`);
            if (croppedImage) {
                setCroppedImg(croppedImage);
            }
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
            console.log(`canvas width=${canvas.width} height=${canvas.height} rotate=${rotateAngle} toRotate=${toRotate}`)
            // find center point to rotate
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(toRotate);
            ctx.drawImage(imageR, -imageR.width/2, -imageR.height/2);
            ctx.rotate(-toRotate);
            ctx.translate(-canvas.width/2, -canvas.height/2);
            // get base64 encoded rotated image
            const rotatedImg = canvas.toDataURL('image/jpeg');
            // create new Image source to continue
            // finalImgR = rotateAngle === 90 || rotateAngle === -90 || rotateAngle === 270 || rotateAngle === -270 
            //     ? new Image(imageR.height, imageR.width)
            //     : new Image(imageR.width, imageR.height);
            // finalImgR = new Image(imageR.width, imageR.height)
            finalImgR = new Image()
            // canvas = document.createElement('canvas');
            finalImgR.src = rotatedImg;
            finalImgR.onload = function() {
                console.log(`loaded final image=(${finalImgR.naturalWidth},${finalImgR.naturalHeight},${finalImgR.width},${finalImgR.height})`)
                const croppedResult = doCrop(finalImgR, canvas, newCrop);
                if (croppedResult) setCroppedImg(croppedResult);
            }
        }

        return doCrop(finalImgR, canvas, newCrop)
      }

    function doCrop(finalImgR, canvas, newCrop) {
        console.log(`final image=(${finalImgR.naturalWidth},${finalImgR.naturalHeight},${finalImgR.width},${finalImgR.height})`)
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
                    onImageLoaded={newImg => setImageRef(newImg)}
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
        </div>
    )
}