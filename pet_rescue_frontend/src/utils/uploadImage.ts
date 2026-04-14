import axios from "axios";

export const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", `${process.env.REACT_APP_CLOUDINARY_PRESET}`);

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        data
    );

    return {
        url: res.data.secure_url,
        public_id: res.data.public_id,
    };
};