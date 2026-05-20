"use client";
import React from 'react';

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { COUNTRY_DIALING_CODES } from "@/lib/constants";

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onPhoneChange: (phone: string) => void;
  onCountryCodeChange: (code: string) => void;
  placeholder?: string;
  className?: string;
}

export function PhoneInput({
  value,
  countryCode,
  onPhoneChange,
  onCountryCodeChange,
  placeholder = "Enter phone number",
  className = "",
}: PhoneInputProps) {
  const selectedCountry = COUNTRY_DIALING_CODES.find(
    (c) => c.dial === countryCode
  ) || COUNTRY_DIALING_CODES.find((c) => c.code === "US");

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={countryCode} onValueChange={onCountryCodeChange}>
        <SelectTrigger className="w-[140px] bg-slate-700/50 border-slate-600 text-white h-10">
          <SelectValue>
            <div className="flex items-center gap-1">
              <span>{selectedCountry?.dial}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600 text-white max-h-[300px]">
          {COUNTRY_DIALING_CODES.map((country) => (
            <SelectItem
              key={country.code}
              value={country.dial}
              className="text-white focus:bg-slate-700 focus:text-white"
            >
              <div className="flex justify-between w-full">
                <span>{country.country}</span>
                <span className="text-slate-400 ml-2">{country.dial}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onPhoneChange(e.target.value.replace(/[^\d\s-+()]/g, ""))}
        className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
      />
    </div>
  );
}
