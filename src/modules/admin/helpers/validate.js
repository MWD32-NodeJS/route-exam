
export default ( data, schema ) => {
  // const { error } = schema.validate (data, { abortEarly: false });
  // else return error.details.map ((e) => { return { path: e.path[0], message: e.message } })
  const { error } = schema.validate (data);
  if (!error) return null
  else return error.details[0].message;
};
