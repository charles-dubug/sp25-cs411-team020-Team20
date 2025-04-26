import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup
        className="flex space-x-1"
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val, 10))}
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="flex items-center">
            <RadioGroupItem
              value={rating.toString()}
              id={`${label}-${rating}`}
              className="sr-only"
            />
            <Label
              htmlFor={`${label}-${rating}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                value >= rating ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              {rating}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RatingInput;

