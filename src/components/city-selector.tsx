"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CITIES, type City } from '../lib/albion-api';

interface CitySelectorProps {
  value: City;
  onValueChange: (city: City) => void;
}

export function CitySelector({ value, onValueChange }: CitySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
        <SelectValue placeholder="Select city" />
      </SelectTrigger>
      <SelectContent>
        {CITIES.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}