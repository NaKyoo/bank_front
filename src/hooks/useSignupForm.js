import { useState } from "react";

export const useSignupForm = (initial = { email: "", password: "" }) => {
  const [values, setValues] = useState(initial);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, handleChange };
};
