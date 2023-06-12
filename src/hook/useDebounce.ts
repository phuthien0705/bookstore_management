import { useState, useEffect } from "react";
interface IUseDebounce {
  value: any;
  delay: number;
}
function useDebounce({ value, delay }: IUseDebounce) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceValue;
}

export default useDebounce;

// how to use this hook?
// Ex code:
// const [inputValue, setInputValue] = useState<string>('');
// const [responseApiData, setResponseApiData] = useState();
//
// const debounceValue = useDebounce(inputValue, 1000); //delay 1000ms
// useEffect(() => {
//  if(!inputValue) return;
//    const res = //call api here
//    setResponseApiData(res);
// }, [debounceValue]);
//
//
//
// <input value={inputValue} onChange={(event: any) => {setInputValue(event.target.value)}} />
// //dropdown: value = responseApiData
