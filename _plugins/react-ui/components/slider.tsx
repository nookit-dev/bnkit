import React from "react";

export type SliderProps = {
  value: number;
  min: number;
  max: number;
  id: string;
  onChange: (value: number) => void;
};

export const Slider = (props: SliderProps) => {
  const { value, onChange, min, max, id } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(event.target.value, 10));
  };

  return (
    <input
      type="range"
      id={id}
      value={value}
      min={min}
      max={max}
      onChange={handleChange}
      className="slider"
    />
  );
};
