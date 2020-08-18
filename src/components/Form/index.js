import React, { useState, useCallback } from "react";

const Form = ({ onSubmit, children }) => {
  const [submitted, setSubmitted] = useState(false);

  const formSubmitted = useCallback(async (event) => {
    event.preventDefault();

    if (!submitted) {
      setSubmitted(true);
      setSubmitted(await onSubmit(event));
    }
  });

  return <form onSubmit={formSubmitted}>{children}</form>;
};

export default Form;
