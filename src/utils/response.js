
class response {

  constructor (
    status = 500,
    success = 0,
    message = "something went wrong!",
    data = undefined
  ) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
  }

};


export default response;
