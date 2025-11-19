import { useState } from "react";
import { validators } from "../utils/validators";

export const useSignupForm = (initial = { email: "", password: "" }) => {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const validator = validators[name];
    if (!validator) return null;
    return validator(value);
  };

  const validateAll = () => {
    const newErrors = {};
    for (const field in values) {
      const error = validateField(field, values[field]);
      if (error) newErrors[field] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return {
    values,
    errors,
    handleChange,
    validateAll,
    setErrors,
  };
};
