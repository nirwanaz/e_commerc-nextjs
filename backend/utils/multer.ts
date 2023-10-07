import { log } from "console";
import multer, {StorageEngine, FileFilterCallback, MulterError} from "multer"

const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        log("file from method storage multer: ", file.originalname)
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        log("file from method storage multer: ", file.originalname)
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const fileFormats: string[] = ["jpeg", "png", "jpg"];
    log("file from method filefilter multer: ", file.originalname)
    const allowed: boolean = fileFormats.includes(file.mimetype.split('/')[1]);

    if (!allowed) {
        const error = new Error("Unsupported file format. Upload only JPEG/JPG or PNG") as MulterError;
        error.code = 'LIMIT_UNEXPECTED_FILE';
        log(error);
        cb(error)
    }

    cb(null, true);
}

const upload = multer({
    storage,
    limits: { fieldSize: 1024 * 1024 },
    fileFilter
})

export default upload;