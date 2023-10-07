import { v2 as cloudinary, UploadApiErrorResponse } from "cloudinary"
import { log } from "console";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
    public_id: string;
    url: string;
}

const uploads = (file: string, folder: string): Promise<UploadResult> => {
    return new Promise<UploadResult>((resolve, reject) => {
        cloudinary.uploader.upload(
            file,
            {
                resource_type: "auto",
                folder: folder,
            },
            (error: UploadApiErrorResponse | undefined, result) => {
                if (error) {
                    // handle cloudinary upload error
                    log("cloudinary: ", error)
                    reject(error)
                } else if (result) {
                    // successfully uploaded
                    resolve({
                        public_id: result.public_id,
                        url: result.url
                    })
                } else {
                    // handle the case where 'result' is undefined
                    reject(new Error('Cloudinary upload result is undefined'))
                }
            },
        );
    });
};

export { uploads, cloudinary };