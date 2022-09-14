const isprod = process.env.NODE_ENV === "production";
if (!isprod) {
  require("husky").install();
}
