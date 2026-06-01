import React from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Options } from "@/lib/data";

const DateTimeFilters = ({ queryDate, setQueryDate }) => {
  return (
    <Combobox
      items={Options}
      value={Options.find((option) => (option.value === queryDate)).label}
      onValueChange={setQueryDate}
    >
      <ComboboxInput placeholder="Select a timeframe" />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default DateTimeFilters;
