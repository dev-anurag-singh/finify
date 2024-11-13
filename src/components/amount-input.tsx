import CurrencyInput from 'react-currency-input-field';

import { Info, MinusCircle, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) => {
  const parsedValue = parseFloat(value);
  //   at 7:02
  return (
    <div className='relative'>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type='button'
              onClick={() => {}}
              className='bg-slate-400 hover:bg-slate-600 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition'
            ></button>
          </TooltipTrigger>
          <TooltipContent align='start'>
            Use [+] for income and [-] for expenses
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        prefix='$'
        placeholder={placeholder}
        value={value}
        decimalsLimit={2}
        decimalScale={2}
        onValueChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};
