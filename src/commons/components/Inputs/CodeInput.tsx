import { useRef, useState } from "react";
import "./CodeInput.css";

interface CodeInputProps {
    length: number;
    label?: string;
    loading: boolean;
    onComplete: (code: string) => void;
    className?: string;
}

export const CodeInput = (props: CodeInputProps) => {
    const { length, label, loading, onComplete, className } = props;
    const [code, setCode] = useState([...Array(length)].map(() => ""));
    const inputs = useRef<HTMLInputElement[]>([]);

  const processInput = (e, slot) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    if (slot !== length - 1) {
      inputs.current[slot + 1].focus();
    }
    if (newCode.every(num => num !== "")) {
      onComplete(newCode.join(""));
    }
  };

  const onKeyUp = (e, slot) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      inputs.current[slot - 1].focus();
    }
  };


  // 现在是截取前六位输入并从头替换当前的输入
  const handlePaste = (e) => {
    e.preventDefault();
    if (loading) return;

    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/[^0-9]/g, '').split('').slice(0, length);
    
    if (numbers.length > 0) {
      const newCode = [...code];
      
      // Fill the code array with pasted numbers
      numbers.forEach((num, index) => {
        if (index < length) {
          newCode[index] = num;
        }
      });
      
      setCode(newCode);
      
      // Focus the next empty input or the last input if all filled
      const nextEmptyIndex = newCode.findIndex(num => num === "");
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
      
      if (inputs.current[focusIndex]) {
        inputs.current[focusIndex].focus();
      }
      
      // Check if all inputs are filled
      if (newCode.every(num => num !== "")) {
        onComplete(newCode.join(""));
      }
    }
  };

  const handleCopy = (e) => {
    e.preventDefault();
    const currentCode = code.join("");
    if (currentCode.length > 0) {
      navigator.clipboard.writeText(currentCode).catch(err => {
        console.error('Failed to copy code:', err);
      });
    }
  };

  return (
    <div className={`code-input ${className}`}>
      <label className="code-label">{label}</label>
      <div className="code-inputs">
        {code.map((num, idx) => {
          return (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={num}
              autoFocus={!code[0].length && idx === 0}
              readOnly={loading}
              onChange={e => processInput(e, idx)}
              onKeyUp={e => onKeyUp(e, idx)}
              onPaste={handlePaste}
              onCopy={handleCopy}
              ref={ref => {
                if (idx === 0) inputs.current = [];
                if (ref) inputs.current[idx] = ref;
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CodeInput;