import { useState } from "react";
import { validators } from "../utils/validators";

export const useLoginForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));

    const error = validators[name] ? validators[name](value) : "";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};

    Object.keys(values).forEach((key) => {
      if (validators[key]) {
        const error = validators[key](values[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    handleChange,
    validateAll,
  };
};
