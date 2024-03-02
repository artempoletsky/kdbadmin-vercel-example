import { Checkbox, Tooltip, CheckboxProps } from "@mantine/core"

type Props = CheckboxProps & {
  tooltip: string
  // label: string
  // onChange: (newVal: boolean) => void
}

export default function CheckboxTooltip(props: Props) {
  const { tooltip } = props;
  

  const newProps: Omit<Props, "tooltip"> = { ...props };
  delete (newProps as any).tooltip;
  
  return <Tooltip label={tooltip}>
    <div className="pt-2 mr-2">
      <Checkbox
        {...newProps}
        // checked={value}
        // onChange={e => onChange(e.target.checked)}
        classNames={{
          label: "cursor-help",
          input: "cursor-help",
        }}
        // label={label}
      />
    </div>
  </Tooltip>
}