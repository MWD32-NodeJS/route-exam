
function responseHandler ( data, req, res, next ) {

  res.status (data.status || 500).json ({
    success: data.success,
    message: data.message,
    data: data.data || undefined,
  })

};

export default responseHandler;