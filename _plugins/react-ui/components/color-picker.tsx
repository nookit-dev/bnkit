import React, { useState } from "react";

export type ColorPickerProps = {
  id: string;
  color: string;
  onChange: (id: string, color: string) => void;
};

export const ColorPicker = (props: ColorPickerProps) => {
  const { id, color, onChange } = props;
  const [currentColor, setCurrentColor] = useState(color);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event?.target?.value;
    setCurrentColor(newColor);
    onChange(id, newColor);
  };

  return (
    <input
      type="color"
      id={id}
      value={currentColor}
      onChange={handleChange}
      className="color-picker"
    />
  );
};
