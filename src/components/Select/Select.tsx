import type { FunctionComponent } from 'react'

interface SelectProps {
  options: Record<string, any>
  value: any
  id: string
  onChange: (value: any) => void
}

export const Select: FunctionComponent<SelectProps> = ({
  options,
  value,
  id,
  onChange
}) => {
  return (
    <select
      onChange={event => onChange(event.target.value)}
      value={value}
      id={id}
    >
      {Object.keys(options).map(key => (
        <option key={key} value={key}>
          {options[key]}
        </option>
      ))}
    </select>
  )
}
