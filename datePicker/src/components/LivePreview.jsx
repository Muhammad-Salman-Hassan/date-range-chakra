import { Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import CustomDateRangePicker from "./DateTimePicker";


export default function LivePreview({ code }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    try {
      const wrapped = `
        ${code}
        return CustomDateRangePicker;
      `;

      // Pass the real CustomDateRangePicker into the sandbox
      const func = new Function("CustomDateRangePicker", wrapped);

      const result = func(CustomDateRangePicker);
      setComponent(() => result);

    } catch (err) {
      setComponent(() => () => (
        <Box color="red.400">
          Error in component code: {err.message}
        </Box>
      ));
    }
  }, [code]);

  return (
    <Box mt={6} p={4} borderWidth="1px" borderRadius="md">
      {Component ? <Component /> : "Loading..."}
      
    </Box>
  );
}
