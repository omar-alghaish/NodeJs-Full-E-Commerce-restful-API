class ApiFeature {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    filter() {
        const queryStringObj = { ...this.queryString };
        const excludesFields = ["page", "sort", "limit", "fields"];
        excludesFields.forEach((fieldIndex) => delete queryStringObj[fieldIndex]);
        //3) Apply filteration using [gte, gt, lte, lt]
        //{price: {$gte: 50}, ratingAverage: {$gte: 4}} must be
        //{price: {gte: 50}, ratingAverage: {gte: 4}}  come in request
        let queryStr = JSON.stringify(queryStringObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }

    sort1() {
        if (this.queryString.sort) {
            //"price, -sold" => [price, -sold] => "price -sold"
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createAt");
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keywords) {
            const query = {};
            if (modelName === "Products") {
                query.$or = [
                    { title: { $regex: this.queryString.keywords }, $option: "i" },
                    { description: { $regex: this.queryString.keywords }, $option: "i" },
                ];
            } else {
                query.$or = [
                    { name: { $regex: this.queryString.keywords }, $option: "i" },
                ];
            }

            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        // pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        if (endIndex < countDocuments) {
            pagination.nextPage = page + 1;
        }
        if (skip > 0) {
            pagination.prevPage = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }
}

module.exports = ApiFeature;
