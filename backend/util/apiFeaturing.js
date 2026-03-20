class ApiFeature {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword ?
        {
            title:{
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }:{}
        
        this.query = this.query.find({...keyword});
        return this;
    }
  
    filter(){
        const queryCopy = {...this.queryStr};
        const removingFields = ['keyword', 'category', 'page', 'postedBy', 'constructionStatus', 'bhk', 'limit'];
        removingFields.forEach((key) => delete queryCopy[key]);
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        // queryStr = queryStr.replace(/\$gte/g, 'temp'); 
        // queryStr = queryStr.replace(/\$lte/g, '$gte');
        // queryStr = queryStr.replace(/temp/g, '$lte');
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    
  
    pagenation(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }

bhk() {
        if (this.queryStr.bhk) {
            const categoriesToMatch = JSON.parse(this.queryStr.bhk);
            if (Array.isArray(categoriesToMatch) && categoriesToMatch.length > 0) {
              this.query = this.query.find({ bhk: { $in: categoriesToMatch } });
            }
          }
        return this;
    }

    constructionStatus() {
        if (this.queryStr.constructionStatus) {
            const categoriesToMatch = JSON.parse(this.queryStr.constructionStatus);
            if (Array.isArray(categoriesToMatch) && categoriesToMatch.length > 0) {
              this.query = this.query.find({ constructionStatus: { $in: categoriesToMatch } });
            }
          }
        return this;
    }

    postedBy() {
        if (this.queryStr.postedBy) {
            const categoriesToMatch = JSON.parse(this.queryStr.postedBy);
            if (Array.isArray(categoriesToMatch) && categoriesToMatch.length > 0) {
              this.query = this.query.find({ postedBy: { $in: categoriesToMatch } });
            }
          }
        return this;
    }
    category() {
      if (this.queryStr.category) {
          const jsonString = this.queryStr.category;
          let isJson;
          try {
              JSON.parse(jsonString);
              isJson = true;
          } catch (e) {
              isJson = false;
          }
          let categoriesToMatch;
          if (isJson) {
              categoriesToMatch = JSON.parse(this.queryStr.category);
          } else {
              categoriesToMatch = this.queryStr.category;
          }
          if (Array.isArray(categoriesToMatch) && categoriesToMatch.length > 0) {
              this.query = this.query.find({ category: { $in: categoriesToMatch } });
          }
      }
      return this;
  }
}
module.exports = ApiFeature;

    // console.log(methods[prop]);
    //   if (this.queryStr.category) {
    //       const jsonString = this.queryStr.category;
    //       let isJson;
    //       try {
    //           JSON.parse(jsonString);
    //           isJson = true;
    //       } catch (e) {
    //           isJson = false;
    //       }
    //       let categoriesToMatch;
    //       if (isJson) {
    //           categoriesToMatch = JSON.parse(this.queryStr.category);
    //       } else {
    //           categoriesToMatch = this.queryStr.category;
    //       }
    //       if (Array.isArray(categoriesToMatch) && categoriesToMatch.length > 0) {
    //           this.query = this.query.find({ category: { $in: categoriesToMatch } });
    //       }
    //   }//   allFilters() {
  //     const methods = {
  //       bhk: this.queryStr.bhk,
  //       constructionStatus: this.queryStr.constructionStatus,
  //       postedBy: this.queryStr.postedBy,
  //       category: this.queryStr.category,
  //     };
  //     console.log('this 1', this.queryStr);
  //     for (const prop in methods) {
  //       if (methods[prop]) {
  //         const jsonString = methods[prop];
  //         let isJson;
  //         try {
  //           JSON.parse(jsonString);
  //           isJson = true;
  //         } catch (e) {
  //           isJson = false;
  //         }
  //         let categoriesToMatch;
  //         if (isJson) {
  //           categoriesToMatch = JSON.parse(methods[prop]);
  //         } else {
  //           categoriesToMatch = methods[prop];
  //         }
  //         if (Array.isArray(categoriesToMatch) && categoriesToMatch.length > 0) {
  //           const filter = {};
  //           filter[prop] = { $in: categoriesToMatch };
  //           this.query = this.query.find(filter);
  //         }
  //       }
  //     }
  //     console.log('this 2', this.queryStr);
  //     return this;
  // }