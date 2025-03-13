import React from "react";

const Button = ({ children, variant, ...props }) => {
  const baseStyle = "px-4 py-2 rounded";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || "bg-gray-500"}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
