const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error.name === "ZodError" || error.issues) {
      const errorDetails = {};
      error.issues.forEach((issue) => {
        const fieldName = issue.path.join(".");
        errorDetails[fieldName] = issue.message;
      });
      return res.status(400).json({ error: "Validation failed", details: errorDetails });
    }
    
    console.error("Validation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default validate;
