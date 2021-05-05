export default (req, res) => {
    const base64EncodedImg = req.body.data
    console.log(base64EncodedImg);
    // cloudinary image api
    res.status(200).json({ ok: true });
}
  