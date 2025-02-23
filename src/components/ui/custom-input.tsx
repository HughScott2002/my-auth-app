// src/components/ui/custom-input.tsx
"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Control, FieldPath, useController } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  placeholder: string;
  type: string;
  icon: React.ReactNode;
  isHidden?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  control,
  name,
  placeholder,
  type: initialType,
  icon,
  isHidden = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(initialType);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const togglePassword = () => {
    if (initialType === "password") {
      setShowPassword(!showPassword);
      setInputType(showPassword ? "password" : "text");
    }
  };

  return (
    <div className="relative">
      <input
        className="appearance-none rounded-xl pl-10 pr-10 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
        placeholder={placeholder}
        type={inputType}
        hidden={isHidden}
        {...field}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      {initialType === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default CustomInput;
