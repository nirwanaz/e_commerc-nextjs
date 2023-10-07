import { log } from "console";
import { Query} from "mongoose";

interface QueryProps {
    [key: string]: string;
    keyword: string;
}

class APIFilters {

    public query;
    public queryStr;

    constructor(query: Query<any, any, {}, any>, queryStr: QueryProps) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }: {}

        this.query = this.query.find({ ...keyword });

        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        // log("queryCopy", queryCopy);
        const removeFields = ['keyword', 'page'];
        removeFields.forEach((el) => delete queryCopy[el]);

        let output: any = {}
        let prop = ""

        for (let key in queryCopy) {
            if (!key.match(/\b(gt|gte|lt|lte)/)) {
                output[key] = queryCopy[key];
            } else {
                prop = key.split("[")[0];

                let findOperator = key.match(/\[(.*)\]/);
                
                if (!findOperator) {
                    return
                }

                if (!output[prop]) {
                    output[prop] = {}
                }

                let operator = findOperator[1];
                
                output[prop][`$${operator}`] = queryCopy[key];
            }            
        }

        // log("output", output);

        this.query = this.query.find(output);
        return this;
    }

    pagination(resPerPage: number) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);

        return this;
    }
}

export default APIFilters;