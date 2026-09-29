// Reusable form helper: keeps values, shows errors only after a field is touched or submit is tried.
import { useState } from "react";

export function useForm({ initialValues, validate }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({}); // errors sent by the backend
  const clientErrors = validate(values);                // recalculated on every render

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setServerErrors((prev) => ({ ...prev, [name]: undefined })); // typing clears the server error
  };
  const handleChange = (e) => setValue(e.target.name, e.target.value);
  const handleBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  const touch = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  // Errors that should actually be displayed.
  const errors = {};
  Object.keys(initialValues).forEach((name) => {
    if (touched[name]) errors[name] = serverErrors[name] || clientErrors[name] || "";
  });

  // handleSubmit(fn) -> returns a <form onSubmit>; fn only runs when all fields are valid.
  const handleSubmit = (onValid) => async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(initialValues).map((k) => [k, true])));
    if (Object.keys(clientErrors).length > 0) return;
    await onValid(values);
  };

  return { values, errors, setValue, touch, handleChange, handleBlur, handleSubmit, setServerErrors };
}
